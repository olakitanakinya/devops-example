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
                        def kubeconfigDir = "${workspace}/tmp-kubeconfig"

                        sh """
                            mkdir -p ${kubeconfigDir}
                            cp ${KUBECONFIG_FILE} ${kubeconfigDir}/config

                            # Extract directory from KUBECONFIG path for additional files
                            KUBE_DIR=\$(dirname "${KUBECONFIG_FILE}")
                            cp \${KUBE_DIR}/client.crt ${kubeconfigDir}/client.crt
                            cp \${KUBE_DIR}/client.key ${kubeconfigDir}/client.key

                            sed -i 's|/home/ola/.minikube/profiles/minikube/|${kubeconfigDir}/|g' ${kubeconfigDir}/config

                            echo "KUBECONFIG file content:"
                            cat ${kubeconfigDir}/config

                            echo "Directory listing:"
                            ls -la ${kubeconfigDir}

                            export KUBECONFIG=${kubeconfigDir}/config
                            kubectl apply -f deployment.yml
                            kubectl apply -f service.yml
                        """
                    }
                }
            }
        }
    }
}

