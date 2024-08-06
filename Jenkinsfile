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
    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
        script {
            def kubeConfigDir = '/var/lib/jenkins/workspace/devops-example/tmp-kubeconfig'
            sh """
                mkdir -p ${kubeConfigDir}
                chmod 700 ${kubeConfigDir}
                cp ${KUBECONFIG_FILE} ${kubeConfigDir}/config
            """
        }
    }
}

            }
        }
    }
}

