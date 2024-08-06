pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/olakitanakinya/devops-example.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t devops-example .'
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
                        def workspace = pwd()
                        sh """
                            mkdir -p ${workspace}/kubeconfig
                            cp ${KUBECONFIG_FILE} ${workspace}/kubeconfig/config
                            sed -i 's|/home/ola/.minikube/profiles/minikube/|${workspace}/kubeconfig/|g' ${workspace}/kubeconfig/config
                            export KUBECONFIG=${workspace}/kubeconfig/config
                            kubectl apply -f deployment.yml
                            kubectl apply -f service.yml
                        """
                    }
                }
            }
        }
    }
}

