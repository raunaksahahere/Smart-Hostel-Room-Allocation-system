"""
Smart Hostel / Hotel Room Allocation Engine
AI-style weighted scoring approach

This script demonstrates how rooms are allocated
fairly based on preferences and budget.
"""

# ----------------------------
# Sample Room Data
# ----------------------------
rooms = [
    {
        "room_id": "A101",
        "type": "Single",
        "price": 3000,
        "available": True
    },
    {
        "room_id": "B202",
        "type": "Double",
        "price": 2000,
        "available": True
    },
    {
        "room_id": "C303",
        "type": "Dorm",
        "price": 1500,
        "available": True
    }
]

# ----------------------------
# Sample Applications
# ----------------------------
applications = [
    {
        "name": "Student 1",
        "preferred_type": "Single",
        "budget": 3500,
        "status": "Pending"
    },
    {
        "name": "Student 2",
        "preferred_type": "Double",
        "budget": 2500,
        "status": "Pending"
    },
    {
        "name": "Student 3",
        "preferred_type": "Single",
        "budget": 2800,
        "status": "Pending"
    }
]

# ----------------------------
# Scoring Function (AI Logic)
# ----------------------------
def calculate_score(room, application):
    score = 0

    # Preference match
    if room["type"] == application["preferred_type"]:
        score += 50

    # Budget compatibility
    if room["price"] <= application["budget"]:
        score += 30

    # Price closeness (smaller difference = higher score)
    price_diff = abs(room["price"] - application["budget"])
    score += max(0, 20 - price_diff)

    return score


# ----------------------------
# Allocation Engine
# ----------------------------
def allocate_rooms(rooms, applications):
    print("\n🚀 Starting Auto Allocation...\n")

    for app in applications:
        if app["status"] != "Pending":
            continue

        best_room = None
        best_score = -1

        for room in rooms:
            if not room["available"]:
                continue

            score = calculate_score(room, app)

            if score > best_score:
                best_score = score
                best_room = room

        if best_room:
            best_room["available"] = False
            app["status"] = f"Allocated {best_room['room_id']}"

            print(
                f"✔ {app['name']} allocated "
                f"Room {best_room['room_id']} "
                f"(Score: {best_score})"
            )
        else:
            print(f"✖ No suitable room for {app['name']}")

    print("\n✅ Allocation Complete\n")


# ----------------------------
# Final Report
# ----------------------------
def print_summary(rooms, applications):
    print("📊 FINAL ALLOCATION SUMMARY\n")

    for app in applications:
        print(f"{app['name']} → {app['status']}")

    print("\n🏨 ROOM AVAILABILITY\n")
    for room in rooms:
        status = "Available" if room["available"] else "Occupied"
        print(f"{room['room_id']} ({room['type']}) → {status}")


# ----------------------------
# Run Engine
# ----------------------------
if __name__ == "__main__":
    allocate_rooms(rooms, applications)
    print_summary(rooms, applications)
