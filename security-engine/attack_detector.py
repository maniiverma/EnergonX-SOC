from scapy.all import sniff, TCP, IP, Raw
import json
import datetime

alerts_file = "../backend/storage/alerts.json"

# Counters
port_scan_counter = {}
login_attempt_counter = {}

# Write alerts
def write_alert(alert_type, source, details):

    alert = {
        "time": str(datetime.datetime.now()),
        "type": alert_type,
        "source": source,
        "details": details
    }

    with open(alerts_file, "a") as f:
        json.dump(alert, f)
        f.write("\n")

    print("ALERT:", alert)


def detect(packet):

    if packet.haslayer(IP):

        src = packet[IP].src

        # -------- PORT SCAN DETECTION --------
        if packet.haslayer(TCP):

            port_scan_counter[src] = port_scan_counter.get(src, 0) + 1

            if port_scan_counter[src] > 50:

                write_alert(
                    "PORT_SCAN",
                    src,
                    "Possible port scanning activity"
                )

                port_scan_counter[src] = 0


        # -------- BRUTE FORCE DETECTION --------
        if packet.haslayer(Raw):

            payload = str(packet[Raw].load)

            if "login" in payload.lower():

                login_attempt_counter[src] = login_attempt_counter.get(src, 0) + 1

                if login_attempt_counter[src] > 10:

                    write_alert(
                        "BRUTE_FORCE",
                        src,
                        "Multiple login attempts detected"
                    )

                    login_attempt_counter[src] = 0


        # -------- SQL INJECTION DETECTION --------
        if packet.haslayer(Raw):

            payload = str(packet[Raw].load).lower()

            sql_patterns = [
                "select ",
                "union ",
                "drop ",
                " or 1=1",
                "insert ",
                "delete "
            ]

            for pattern in sql_patterns:

                if pattern in payload:

                    write_alert(
                        "SQL_INJECTION",
                        src,
                        f"Suspicious payload detected: {pattern}"
                    )

                    break


        # -------- SUSPICIOUS TRAFFIC --------
        if packet.haslayer(TCP):

            if packet[TCP].flags == "S":

                port = packet[TCP].dport

                if port > 10000:

                    write_alert(
                        "SUSPICIOUS_TRAFFIC",
                        src,
                        f"Connection to unusual port {port}"
                    )


print("EnergonX Attack Detection Engine Running...")

sniff(prn=detect, store=False)
