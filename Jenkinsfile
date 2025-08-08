pipeline {
    agent any

    stages {

        stage('Run front test') {
            agent { label 'front-agent' }
            stage('Clone Frontend Repository') {
    
   	 	git branch: 'master', url: 'https://github.com/AdilGHAZAL/mybank.git'
		}

		dir('mybank-frontend') 	{
	    sh "echo 'VITE_API_BASE_URL=${VITE_API_BASE_URL}' > .env"
	    sh 'cat .env'
	    sh 'npm install dotenv'  // si vraiment nécessaire, sinon déjà dans package.json
	    sh 'npm install'
	    sh 'npx vitest run'
		}
        }

        stage('Build & Push Frontend Docker Image') {
    git branch: 'master', url: 'https://github.com/AdilGHAZAL/mybank.git'
    dir('mybank-frontend') {
        sh "echo 'VITE_API_BASE_URL=${VITE_API_BASE_URL}' > .env"
        sh "docker build .  -t ${DOCKERHUB_USERNAME}/mybank_front:latest"
        sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
        sh "docker push ${DOCKERHUB_USERNAME}/mybank_front:latest"
    }
}

stage('Deploy Frontend') {
    withCredentials([
        sshUserPrivateKey(credentialsId: 'ssh-root', keyFileVariable: 'SSH_KEY')
    ]) {
        sh """
            ssh -i \$SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} '
                docker pull ${DOCKERHUB_USERNAME}/mybank_front:latest &&
                docker stop mybank_front || true &&
                docker rm mybank_front || true &&
                docker run -d --name mybank_front -p 3001:3000 ${DOCKERHUB_USERNAME}/mybank_front:latest
            '
        """
    }
}

        stage('Install Backend') {
            agent { node { label 'backend-agent' } }
		dir('mybank-backend') {
        sh """
            echo \"APP_ENV=${APP_ENV}
            APP_SECRET=${APP_SECRET}
            DATABASE_URL=${DATABASE_URL}
            CORS_ALLOW_ORIGIN=${CORS_ALLOW_ORIGIN}
            JWT_SECRET_KEY=${JWT_SECRET_KEY}
            JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
            JWT_PASSPHRASE=${JWT_PASSPHRASE}\" > .env
        """
        sh 'composer install'

    }
        }

        stage('Test Backend') {
	   sh 'php bin/phpunit'
        }

        stage('Backend build image Pipeline') {
            agent { label "${AGENT_DOCKER}" }
            steps {
                sh "docker build . -t ${DOCKERHUB_USERNAME}/mybank_api"
            sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKER_PASSWORD}"
            sh "docker push ${DOCKERHUB_USERNAME}/mybank_api"
            }
        }


    }
}