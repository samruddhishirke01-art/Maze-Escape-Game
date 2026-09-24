from flask import Flask, render_template, jsonify
from collections import deque

app = Flask(__name__)

# 0 = path
# 1 = wall
maze = [
    [0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0]
]

START = (0, 0)
END = (6, 6)


# ------------------------------------------------
# BFS - Shortest Path Algorithm
# ------------------------------------------------

def bfs_shortest_path():

    rows = len(maze)
    cols = len(maze[0])

    # Queue
    queue = deque()

    # Add starting position
    queue.append((START, [START]))

    # Visited set
    visited = set()
    visited.add(START)

    # Up, Down, Left, Right
    directions = [
        (-1, 0),
        (1, 0),
        (0, -1),
        (0, 1)
    ]

    while queue:

        current, path = queue.popleft()

        row, col = current

        # Destination reached
        if current == END:
            return path

        # Explore neighbours
        for dr, dc in directions:

            new_row = row + dr
            new_col = col + dc

            # Check boundaries
            if 0 <= new_row < rows and 0 <= new_col < cols:

                new_position = (new_row, new_col)

                # Check whether it is a path
                if maze[new_row][new_col] == 0:

                    # Check whether already visited
                    if new_position not in visited:

                        visited.add(new_position)

                        new_path = path + [new_position]

                        queue.append(
                            (new_position, new_path)
                        )

    return None


# ------------------------------------------------
# Home Page
# ------------------------------------------------

@app.route("/")
def home():
    return render_template(
        "index.html",
        maze=maze
    )


# ------------------------------------------------
# API - Get Shortest Path
# ------------------------------------------------

@app.route("/shortest-path")
def shortest_path():

    path = bfs_shortest_path()

    if path:

        # Convert tuples into lists
        path = [
            list(position)
            for position in path
        ]

        return jsonify({
            "success": True,
            "path": path,
            "steps": len(path) - 1
        })

    return jsonify({
        "success": False,
        "message": "No path found"
    })


if __name__ == "__main__":
    app.run(debug=True)