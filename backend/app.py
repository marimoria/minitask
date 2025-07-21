from flask import Flask, request, jsonify
from pathlib import Path
import os, json
import uuid

APP_DIR = Path(os.getenv("APPDATA") or Path.home()) / "MiniTasks"
TASKS_FILE = APP_DIR / "minitasks.json"

app = Flask(__name__)

# Utilities
def load_tasks():
    APP_DIR.mkdir(parents=True, exist_ok=True)

    if not TASKS_FILE.exists():
        with open(TASKS_FILE, 'w') as f:
            json.dump({
                "todoTasks": [],
                "progressTasks": [],
                "doneTasks": []
            }, f)

    with open(TASKS_FILE, 'r') as f:
        return json.load(f)

def save_tasks(data):
    with open(TASKS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def generate_id():
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

# Routes
@app.route('/tasks', methods=['GET'])
def get_all_tasks():
    return jsonify(load_tasks())

@app.route('/tasks/<string:status>', methods=['GET'])
def get_tasks_by_status(status): # "todo", "progress", "done"
    data = load_tasks()
    key = f"{status}Tasks"

    if key not in data:
        return jsonify({"error": "Invalid status"}), 400
    return jsonify(data[key])

@app.route('/tasks/<string:task_id>', methods=['GET'])
def get_task_by_id(task_id):
    data = load_tasks()
    for key in ["todoTasks", "progressTasks", "doneTasks"]:
        for task in data[key]:
            if task["id"] == task_id:
                return jsonify(task), 200
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks', methods=['POST'])
def add_task():
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

@app.route('/tasks/<string:task_id>', methods=['DELETE'])
def delete_task(task_id):
    data = load_tasks()
    found = False

    for key in ["todoTasks", "progressTasks", "doneTasks"]:
        ogTotalTasks = len(data[key])
        data[key] = [task for task in data[key] if task['id'] != task_id] # replaces current list with tasks that doesnt match the id

        if len(data[key]) < ogTotalTasks:
            found = True
            break
    
    if not found:
        return jsonify({'error': 'Task not found'}), 404
    
    save_tasks(data)
    return '', 204

@app.route('/tasks/move', methods=['PATCH'])
def move_task():
    payload = request.json

    task_id = payload.get("id")
    from_status = payload.get("from")
    to_status = payload.get("to")  # "todo", "progress", "done"

    valid_keys = {"todo": "todoTasks", "progress": "progressTasks", "done": "doneTasks"}

    if to_status not in valid_keys or from_status not in valid_keys:
        return jsonify({"error": "Invalid status"}), 400

    data = load_tasks()
    task_to_move = None
    
    # Remove from old status
    for task in data[valid_keys[from_status]]:
        if task["id"] == task_id:
            task_to_move = task
            data[valid_keys[from_status]].remove(task_to_move)
            break

    if not task_to_move:
        return jsonify({"error": "Task not found"}), 404

    # Add to new status
    data[valid_keys[to_status]].append(task_to_move)
    save_tasks(data)
    return jsonify(task_to_move), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)