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

                            # Extract directory from KUBECONFIG path for additional files
                            KUBE_DIR=\$(dirname "${KUBECONFIG_FILE}")
                            cp \${KUBE_DIR}/client.crt ${workspace}/kubeconfig/client.crt
                            cp \${KUBE_DIR}/client.key ${workspace}/kubeconfig/client.key

                            sed -i 's|/home/ola/.minikube/profiles/minikube/|${workspace}/kubeconfig/|g' ${workspace}/kubeconfig/config

                            echo "KUBECONFIG file content:"
                            cat ${workspace}/kubeconfig/config

                            echo "Directory listing:"
                            ls -la ${workspace}/kubeconfig

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

