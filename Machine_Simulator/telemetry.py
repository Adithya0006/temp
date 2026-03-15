# telemetry.py

from datetime import datetime
import random
import requests

# Backend API endpoint where telemetry will be sent
BACKEND_URL = "http://127.0.0.1:8000/machine/telemetry"


def generate_alert():
    """
    Randomly generate machine alerts.
    Most of the time there will be no alert.
    """

    alerts = [
        "NONE",
        "NONE",
        "NONE",
        "LOW_PASTE",
        "OVERHEAT",
        "COMPONENT_MISSING"
    ]

    return random.choice(alerts)


def generate_telemetry(machine_id, pcb_id, start_time, end_time):
    """
    Creates telemetry dictionary for a machine event.
    """

    telemetry = {

        # Machine identifier (example: PRINTER, SPI, REFLOW)
        "machine_id": machine_id,

        # Current machine state
        "machine_status": "RUNNING",

        # PCB being processed
        "pcb_id": pcb_id,

        # PCB processing start time
        "pcb_start_time": start_time.strftime("%H:%M:%S"),

        # PCB processing end time
        "pcb_end_time": end_time.strftime("%H:%M:%S"),

        # Random machine alert
        "alert": generate_alert(),

        # Time when telemetry is generated
        "timestamp": datetime.now().strftime("%H:%M:%S")
    }

    return telemetry


def send_telemetry(telemetry):
    """
    Sends telemetry to FastAPI backend.
    """

    try:

        # Send POST request to backend
        response = requests.post(
            BACKEND_URL,
            json=telemetry,
            timeout=2
        )

        # Print success response
        print("\nTelemetry sent to backend:", response.status_code)

    except Exception as e:

        # If backend is not running
        print("\n⚠ Backend not reachable:", e)


def log_and_send(machine_id, pcb_id, start_time, end_time):
    """
    Helper function used by machine threads.

    1. Generate telemetry
    2. Print telemetry
    3. Send telemetry to backend
    """

    telemetry = generate_telemetry(
        machine_id,
        pcb_id,
        start_time,
        end_time
    )

    # Print telemetry locally
    print("\nMachine Telemetry ->", telemetry)

    # Send telemetry to backend
    send_telemetry(telemetry)

    return telemetry
