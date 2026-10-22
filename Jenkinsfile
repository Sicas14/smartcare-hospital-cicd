
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'SmartCare Hospital CI/CD Pipeline'
                echo 'GitHub source configuration is ready.'
            }
        }

        stage('Check Project') {
            steps {
                bat 'dir'
            }
        }

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t sicas/smartcare-backend:latest ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t sicas/smartcare-frontend:latest ./frontend'
            }
        }
    }
}
