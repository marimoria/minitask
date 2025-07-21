from flask import Flask, request, jsonify
from pathlib import Path
import os, json
import uuid
import sys
from flask_cors import CORS

if getattr(sys, 'frozen', False):
    BASE_DIR = Path(os.getenv("APPDATA") or Path.home()) / "MiniTasks"
else:
    BASE_DIR = Path(__file__).parent.resolve()

app = Flask(__name__)
CORS(app)

BASE_DIR.mkdir(parents=True, exist_ok=True)

LOG_FILE = BASE_DIR / "log.txt"
TASKS_FILE = BASE_DIR / "minitasks.json"

# Utilities
def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(f"{msg}\n")

def load_tasks():
    try:
        if not TASKS_FILE.exists():
            with open(TASKS_FILE, 'w') as f:
                json.dump({
                    "todoTasks": [],
                    "progressTasks": [],
                    "doneTasks": []
                }, f)

        with open(TASKS_FILE, 'r') as f:
            return json.load(f)

    except Exception as e:
        log(f"Failed to load tasks: {e}")
        return {
            "todoTasks": [],
            "progressTasks": [],
            "doneTasks": []
        }


def save_tasks(data):
    try:
        with open(TASKS_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        log(f"Failed to save tasks: {e}")


def generate_id():
    try:
        data = load_tasks()
        existing_ids = {
            task["id"]
            for key in ["todoTasks", "progressTasks", "doneTasks"]
            for task in data[key]
        }

        new_id = str(uuid.uuid4())[:8]
        while new_id in existing_ids:
            new_id = str(uuid.uuid4())[:8]

        return new_id
    except Exception as e:
        log(f"Failed to generate ID: {e}")
        return "error-id"


# Routes
@app.route('/tasks', methods=['GET'])
def get_all_tasks():
    try:
        return jsonify(load_tasks())
    except Exception as e:
        log(f"GET /tasks error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/tasks/<string:status>', methods=['GET'])
def get_tasks_by_status(status):
    try:
        data = load_tasks()
        key = f"{status}Tasks"

        if key not in data:
            return jsonify({"error": "Invalid status"}), 400
        return jsonify(data[key])
    except Exception as e:
        log(f"GET /tasks/{status} error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/tasks/<string:task_id>', methods=['GET'])
def get_task_by_id(task_id):
    try:
        data = load_tasks()
        for key in ["todoTasks", "progressTasks", "doneTasks"]:
            for task in data[key]:
                if task["id"] == task_id:
                    return jsonify(task), 200
        return jsonify({"error": "Task not found"}), 404
    except Exception as e:
        log(f"GET /tasks/{task_id} error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/tasks', methods=['POST'])
def add_task():
    try:
        log("add")
        payload = request.json
        if not payload or 'taskDesc' not in payload:
            return jsonify({'error': 'Missing taskDesc'}), 400

        task = {
            "id": generate_id(),
            "taskDesc": payload['taskDesc']
        }

        all_tasks = load_tasks()
        all_tasks["todoTasks"].append(task)
        save_tasks(all_tasks)
        return jsonify(task), 201

    except Exception as e:
        log(f"POST /tasks error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/tasks/<string:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        data = load_tasks()
        found = False

        for key in ["todoTasks", "progressTasks", "doneTasks"]:
            ogTotalTasks = len(data[key])
            data[key] = [task for task in data[key] if task['id'] != task_id]
            if len(data[key]) < ogTotalTasks:
                found = True
                break

        if not found:
            return jsonify({'error': 'Task not found'}), 404

        save_tasks(data)
        return '', 204

    except Exception as e:
        log(f"DELETE /tasks/{task_id} error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/tasks/move', methods=['PATCH'])
def move_task():
    try:
        payload = request.json
        task_id = payload.get("id")
        from_status = payload.get("from")
        to_status = payload.get("to")

        valid_keys = {"todo": "todoTasks", "progress": "progressTasks", "done": "doneTasks"}

        if to_status not in valid_keys or from_status not in valid_keys:
            return jsonify({"error": "Invalid status"}), 400

        data = load_tasks()
        task_to_move = None

        for task in data[valid_keys[from_status]]:
            if task["id"] == task_id:
                task_to_move = task
                data[valid_keys[from_status]].remove(task_to_move)
                break

        if not task_to_move:
            return jsonify({"error": "Task not found"}), 404

        data[valid_keys[to_status]].append(task_to_move)
        save_tasks(data)
        return jsonify(task_to_move), 200

    except Exception as e:
        log(f"PATCH /tasks/move error: {e}")
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000)
    except Exception as e:
        log(f"App failed to start: {e}")