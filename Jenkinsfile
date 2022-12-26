node {
    def app
    def IMAGETAG
    def scmVars
    def gitCommit
    def today = new Date()
    def APPENV
    def curBranch

    stage('Clone repository') {     
        scmVars = checkout scm

        gitCommit = scmVars.GIT_COMMIT.substring(0, 10);
        curBranch = scmVars.GIT_BRANCH

        if (curBranch.indexOf("feature/") > -1 || curBranch.indexOf("bugfix/") > -1) {
            APPENV = "dev"
        } else if (curBranch.indexOf("release/") > -1) {
            APPENV = "uat"
        } else if (curBranch.indexOf("main/") > -1 || curBranch.indexOf("hotfix/") > -1) {
            APPENV = "prd"
        } else {
            process.exit()
        }        
    }

        stage('Build image') {  
       app = docker.build("myhk2009/nodetest", "--no-cache")
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
        }
    }
        
    stage('Trigger ManifestUpdate') {
        echo "triggering updatemanifestjob"
        build job: 'nodejs-update-manifest', 
        parameters: [
            string(name: 'DOCKERTAG', value: "${IMAGETAG}"), 
            string(name: 'APPENV', value: "${APPENV}"),
            string(name: 'BRANCHNAME', value: "${curBranch}")
            ]
    }

    stage ('Send Email for approval') {
        emailext body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}",
        recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
        subject: "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}"
    }
}
