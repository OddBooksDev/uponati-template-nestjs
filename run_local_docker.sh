#!/bin/bash
set -e

#################################################################
#                       Function Definitions                    #
#################################################################

get_docker_compose_command() {
    check_port="lsof -i :5432"

    # 포트 상태에 따른 Docker Compose 명령어 실행
    if eval "$check_port" >/dev/null 2>&1; then
        docker compose -f "$DOCKER_COMPOSE_FILE" up $SERVICE_NAME -d
    else
        docker compose -f "$DOCKER_COMPOSE_FILE" up -d
    fi
}

# 데이터베이스 존재 여부 확인 및 생성 함수
check_and_create_database() {
    # 애플리케이션 상태 확인 (헬스 체크 대기)
    echo "Application '$SERVICE_NAME' is ready. Now checking PostgreSQL status on port 5432..."

    # PostgreSQL 준비 상태 확인
    timeout=180
    interval=5
    elapsed=0
    until docker compose -f "$DOCKER_COMPOSE_FILE" exec postgres pg_isready -U postgres -h localhost -p 5432; do
        if [ $elapsed -ge $timeout ]; then
            echo "PostgreSQL is not ready after $timeout seconds. Exiting."
            return 1
        fi
        echo "PostgreSQL is not ready. Waiting $interval seconds..."
        sleep $interval
        elapsed=$((elapsed + interval))
    done

    echo "PostgreSQL is ready. Checking if database '$SERVICE_DB_NAME' exists..."

    # 데이터베이스 존재 여부 확인 및 생성
    if docker compose -f "$DOCKER_COMPOSE_FILE" exec postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='$SERVICE_DB_NAME';" | grep -q 1; then
        echo "Database '$SERVICE_DB_NAME' already exists. Skipping creation."
    else
        echo "Database '$SERVICE_DB_NAME' does not exist. Creating database..."
        docker compose -f "$DOCKER_COMPOSE_FILE" exec postgres psql -U postgres -c "CREATE DATABASE \"$SERVICE_DB_NAME\";"
        echo "Database '$SERVICE_DB_NAME' created successfully."
    fi
    echo "Database '$SERVICE_DB_NAME' is ready. Now syncing the database schema..."
    sleep 5
    # 직접 해당 부분 수정해서 템플릿 기본 구성 맞추기
    # docker compose -f "$DOCKER_COMPOSE_FILE" exec $SERVICE_NAME yarn db:sync 
    echo "Database schema synced successfully."
    sleep 5
    echo "Restarting the '$SERVICE_NAME' container..."
    docker compose -f "$DOCKER_COMPOSE_FILE" restart $SERVICE_NAME
}


#################################################################
#                          Main Script                          #
#################################################################

echo "Please choose an action:"
echo "  start the Docker Compose >>> [start or s]"
echo "  stop the Docker Compose >>> [stop or t]"
read -p "Do you want to start or stop the Docker Compose? (start/stop) [default: start]: " choice
SERVICE_NAME="your_service_name"
SERVICE_DB_NAME="your_database"

choice=${choice:-start}
choice=$(echo "$choice" | tr '[:upper:]' '[:lower:]')

DOCKER_COMPOSE_FILE="$PWD/docker-local/docker-compose.yml"

if [[ "$choice" == "start" || "$choice" == "s" ]]; then
    echo "Starting Docker Compose..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        docker run -it --rm -v "$PWD":/app -w /app node:20.18.0 bash -c "yarn install"
    elif grep -qEi "(Microsoft|WSL)" /proc/version &>/dev/null; then
        # WSL2 Ubuntu에서 --user 옵션을 포함하여 실행
        USER_ID=$(id -u)
        GROUP_ID=$(id -g)
        docker run -it --rm -v "$PWD":/app -w /app --user "$USER_ID:$GROUP_ID" node:20.18.0 bash -c "yarn install"
    else
        echo -e "\e[31mWindows에서 스크립트를 실행 중입니다. WSL2 Ubuntu 22.04를 사용해 주세요.\e[0m"
        exit 1
    fi

    get_docker_compose_command
    check_and_create_database
    docker compose -f "$DOCKER_COMPOSE_FILE" logs -f $SERVICE_NAME 
elif [[ "$choice" == "stop" || "$choice" == "t" ]]; then
    echo "Stopping Docker Compose..."
    docker compose -f "$DOCKER_COMPOSE_FILE" down
else
    echo "Invalid choice. Exiting."
    exit 1
fi