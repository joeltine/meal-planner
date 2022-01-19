#!/usr/bin/env bash

ssh -T mealplanner@192.168.1.211 << EOF
  cd /opt/meal-planner
  git pull
  ./mvnw clean package -DskipTests && sudo /usr/bin/systemctl restart meal-planner.service
EOF
