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

                            echo "Copying client certificate and key files from \${KUBE_DIR} to ${kubeconfigDir}"

                            # List files in KUBE_DIR for debugging
                            echo "Listing files in \${KUBE_DIR}:"
                            ls -la \${KUBE_DIR}

                            if [ -f "\${KUBE_DIR}/client.crt" ]; then
                                cp \${KUBE_DIR}/client.crt ${kubeconfigDir}/client.crt
                            else
                                echo "client.crt not found in \${KUBE_DIR}"
                                exit 1
                            fi

                            if [ -f "\${KUBE_DIR}/client.key" ]; then
                                cp \${KUBE_DIR}/client.key ${kubeconfigDir}/client.key
                            else
                                echo "client.key not found in \${KUBE_DIR}"
                                exit 1
                            fi

                            sed -i 's|/home/ola/.minikube/profiles/minikube/|${kubeconfigDir}/|g' ${kubeconfigDir}/config

                            echo "KUBECONFIG file content:"
                            cat ${kubeconfigDir}/config

                            echo "Directory listing of ${kubeconfigDir}:"
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

