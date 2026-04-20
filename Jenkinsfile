pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    tools {
        nodejs 'node18'
    }

    parameters {
        string(name: 'APP_DIR', defaultValue: '.', description: 'App directory relative to repo root (use "." or "engineering-universe")')
        string(name: 'DOCKER_IMAGE', defaultValue: '', description: 'Optional image name, for example docker.io/your-user/cosmicverse:latest')
        booleanParam(name: 'PUSH_IMAGE', defaultValue: false, description: 'Push image after build (requires Docker registry credentials)')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Toolchain') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'node -v && npm -v'
                    } else {
                        bat 'node -v && npm -v'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${params.APP_DIR}") {
                    script {
                        if (isUnix()) {
                            sh 'npm ci --include=dev'
                        } else {
                            bat 'npm ci --include=dev'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                dir("${params.APP_DIR}") {
                    script {
                        if (isUnix()) {
                            sh 'npm run build'
                        } else {
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Archive dist') {
            steps {
                archiveArtifacts artifacts: "${params.APP_DIR}/dist/**", fingerprint: true, onlyIfSuccessful: true
            }
        }

        stage('Docker Build') {
            when {
                expression { return params.DOCKER_IMAGE?.trim() }
            }
            steps {
                script {
                    def dockerfilePath = "${params.APP_DIR}/Dockerfile"
                    def contextPath = "${params.APP_DIR}"
                    if (isUnix()) {
                        sh "docker build -t ${params.DOCKER_IMAGE} -f ${dockerfilePath} ${contextPath}"
                    } else {
                        bat "docker build -t ${params.DOCKER_IMAGE} -f ${dockerfilePath} ${contextPath}"
                    }
                }
            }
        }

        stage('Docker Push') {
            when {
                allOf {
                    expression { return params.PUSH_IMAGE }
                    expression { return params.DOCKER_IMAGE?.trim() }
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        if (isUnix()) {
                            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                            sh "docker push ${params.DOCKER_IMAGE}"
                        } else {
                            bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                            bat "docker push ${params.DOCKER_IMAGE}"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs(deleteDirs: true)
        }
    }
}