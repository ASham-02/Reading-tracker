import json
import urllib.request
import urllib.error

API_URL = "http://localhost:3000/health"


def check_api_health():
    try:
        with urllib.request.urlopen(API_URL, timeout=5) as response:
            status_code = response.status
            body = response.read().decode("utf-8")
            data = json.loads(body)

            print("Reading Tracker API Health Report")
            print("---------------------------------")
            print(f"URL: {API_URL}")
            print(f"HTTP status: {status_code}")
            print(f"Service: {data.get('service')}")
            print(f"API status: {data.get('status')}")

            if status_code == 200 and data.get("status") == "ok":
                print("\nResult: API is healthy.")
            else:
                print("\nResult: API responded, but the health check was unexpected.")

    except urllib.error.URLError as error:
        print("Reading Tracker API Health Report")
        print("---------------------------------")
        print(f"URL: {API_URL}")
        print("\nResult: API could not be reached.")
        print(f"Error: {error}")


if __name__ == "__main__":
    check_api_health()