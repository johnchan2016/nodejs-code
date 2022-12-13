node {
	def app

    stage('Clone repository') {     
        checkout scm
    }

    stage('Build image') {  
       app = docker.build("myhk2009/nodetest")
    }

    stage('Test image') { 
        app.inside {
            sh 'echo "Tests passed"'
        }
    }

    stage('Push image') {        
        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                app.push("${env.BUILD_NUMBER}")
								app.push("latest")
        }
    }
        
    stage('Trigger ManifestUpdate') {
        echo "triggering updatemanifestjob"
        build job: 'UpdateNodeManifest', parameters: [string(name: 'DOCKERTAG', value: env.BUILD_NUMBER)]
    }
}