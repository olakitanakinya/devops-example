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
                withCredentials([file(credentialsId: 'kubeconfig-id', variable: 'KUBECONFIG')]) {
                    sh '''
                        mkdir -p /tmp/kubeconfig
                        cp $KUBECONFIG /tmp/kubeconfig/config
                        export KUBECONFIG=/tmp/kubeconfig/config
                        kubectl apply -f deployment.yml
                        kubectl apply -f service.yml
                    '''
                }
            }
        }
    }
}

