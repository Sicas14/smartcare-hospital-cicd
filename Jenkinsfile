
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
        bat 'set KUBECONFIG=C:\\Users\\adars\\.kube\\config&& "C:\\Users\\adars\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" config current-context'
bat 'set KUBECONFIG=C:\\Users\\adars\\.kube\\config&& "C:\\Users\\adars\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" get deployments'    }
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
        
   
        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    bat '''
                        @echo off
                        set "DOCKER_CONFIG=%WORKSPACE%\\.docker-config"
                        if not exist "%DOCKER_CONFIG%" mkdir "%DOCKER_CONFIG%"
                        echo %DOCKERHUB_TOKEN%| "%DOCKER%" login -u "%DOCKERHUB_USER%" --password-stdin
                        if errorlevel 1 exit /b 1
                        "%DOCKER%" push sicas/smartcare-backend:latest
                        if errorlevel 1 exit /b 1
                        "%DOCKER%" push sicas/smartcare-frontend:latest
                        if errorlevel 1 exit /b 1
                    '''
                }
            }
        }

           stage('Deploy to Kubernetes') {
            steps {
                bat 'set KUBECONFIG=C:\\Users\\adars\\.kube\\config&& "C:\\Users\\adars\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" rollout restart deployment/smartcare-backend'
                bat 'set KUBECONFIG=C:\\Users\\adars\\.kube\\config&& "C:\\Users\\adars\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" rollout restart deployment/smartcare-frontend'
                bat 'set KUBECONFIG=C:\\Users\\adars\\.kube\\config&& "C:\\Users\\adars\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" rollout status deployment/smartcare-backend --timeout=120s'
                bat 'set KUBECONFIG=C:\\Users\\adars\\.kube\\config&& "C:\\Users\\adars\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" rollout status deployment/smartcare-frontend --timeout=120s'
            }
        } }
}
