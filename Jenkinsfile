pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "devops-example"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
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
                        // Create a temporary directory for kubeconfig
                        def kubeconfigDir = "${pwd()}/tmp-kubeconfig"
                        sh """
                            mkdir -p ${kubeconfigDir}
                            chmod 700 ${kubeconfigDir}
                            cp ${KUBECONFIG_FILE} ${kubeconfigDir}/config
                            export KUBECONFIG=${kubeconfigDir}/config
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

