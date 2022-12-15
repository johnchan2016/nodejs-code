node {
	def app
    def IMAGETAG
    def scmVars
    def gitCommit
    def today = new Date()

    stage('Clone repository') {     
        scmVars = checkout scm

        gitCommit = scmVars.GIT_COMMIT.substring(0, 10);
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

            IMAGETAG = "${today.format('yyyyMMdd')}-${APPENV}-${gitCommit}"
            app.push("${IMAGETAG}")
			app.push("latest")

            echo "IMAGETAG: ${IMAGETAG}"
        }
    }
        
    stage('Trigger ManifestUpdate') {
        echo "triggering updatemanifestjob"
        build job: 'UpdateNodeManifest', parameters: [string(name: 'DOCKERTAG', value: "${IMAGETAG}")]
    }
}