
pipeline {
    agent any

    environment {
        DOCKER = 'C:\\Users\\adars\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'SmartCare Hospital CI/CD Pipeline'
            }
        }

        stage('Check Project') {
            steps {
                bat 'dir'
            }
        }

        stage('Check Docker') {
            steps {
                bat '"%DOCKER%" --version'
            }
        }

        stage('Build Backend Image') {
            steps {
                bat '"%DOCKER%" build -t sicas/smartcare-backend:latest ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat '"%DOCKER%" build -t sicas/smartcare-frontend:latest ./frontend'
            }
        }
    }
}
