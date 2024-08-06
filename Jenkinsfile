pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "devops-example"
    }

    stages {
        stage('Declarative: Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/olakitanakinya/devops-example.git', branch: 'master'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE} .'
            }
        }

        stage('Deploy with Ansible') {
            steps {
                sh 'ansible-playbook deploy.yml'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-id', variable: 'KUBECONFIG_FILE')]) {
                    script {
                        def kubeConfigDir = '/var/lib/jenkins/workspace/devops-example/tmp-kubeconfig'
                        sh """
                            mkdir -p ${kubeConfigDir}
                            chmod 700 ${kubeConfigDir}
                            cp ${KUBECONFIG_FILE} ${kubeConfigDir}/config
                            export KUBECONFIG=${kubeConfigDir}/config
                            kubectl apply -f deployment.yaml
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

