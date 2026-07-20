import subprocess
import json
import datetime

def run_scan(target):

    command = ["nmap", "-sV", "-T4", target]

    result = subprocess.run(command, capture_output=True, text=True)

    scan_result = {
        "target": target,
        "time": str(datetime.datetime.now()),
        "result": result.stdout
    }

    with open("../backend/storage/scans.json", "a") as f:
        json.dump(scan_result, f)
        f.write("\n")

    return result.stdout


if __name__ == "__main__":

    target = input("Enter target IP/domain: ")

    output = run_scan(target)

    print(output)
