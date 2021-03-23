pipeline {
  agent {
    kubernetes {
      defaultContainer 'alpine'
      yaml """
        apiVersion: v1
        kind: Pod
        metadata:
          labels:
            jenkins-pipeline: kaleidoscope
        spec:
          containers:
          - name: node
            image: node:latest
            command:
            - cat
            tty: true
          - name: dependency-check
            image: owasp/dependency-check:latest
            command:
            - cat
            tty: true
          - name: sonarscanner
            image: sonarsource/sonar-scanner-cli:latest
            command:
            - cat
            tty: true
          - name: owasp
            image: owasp/zap2docker-stable:latest
            command:
            - cat
            tty: true
            volumeMounts:
              - name: zap-work
                mountPath: /zap/wrk
          - name: kaniko
            image: gcr.io/kaniko-project/executor:debug
            imagePullPolicy: Always
            command:
            - /busybox/cat
            tty: true
            volumeMounts:
              - name: docker-config
                mountPath: /mnt/kaniko/.docker
          volumes:
            - name: docker-config
              configMap:
                name: docker-config
            - name: zap-work
              emptyDir: {}
      """
    }
  }
  stages {
	  
    stage ('Kaniko Build & Push Docker Image') {
      steps {
        container('kaniko') {
	    sh "ls -a /kaniko"
	    sh "pwd"
	    sh """
	    echo '{"auths":{"r.csf.internal":{"username":"admin","password":"admin123"}}}' > /kaniko/.docker/config.json
	    """
	    sh "cat /kaniko/.docker/config.json"
	    sh "/kaniko/executor --insecure --verbosity trace --dockerfile `pwd`/Dockerfile --context `pwd` --destination=docker.test.kaleidoscope/app:latest"
        }
      }
    }
	  
    stage ('SonarQube Scan') {
      steps {
        container('sonarscanner'){
          sh "sonar-scanner -Dproject.settings=./sonar.properties"
        }
      }
    }

    stage ('OWASP Dependency-Check Vulnerabilities') {
      steps {
        container('dependency-check'){
          sh """
            /usr/share/dependency-check/bin/dependency-check.sh --out . --scan .
            cat ./dependency-check-report.html
          """
        }
      }
    }


    stage ('NPM Install') {
      steps {
        container('node'){
          sh """
	    npm config set registry="http://registry.npmjs.org/tunnel-agent/-/tunnel-agent-0.6.0.tgz"
            export npm_config_cache=npm-cache
            export HOME=.
            npm install --force
          """
        }
      }
    }
	  
    stage('OWASP Zap Scan') {
        steps {
         	   container('owasp') {

         	       sh """
         	        zap-cli start --start-options '-config api.disableKey=true'
         	        zap-cli open-url http://juice-shop.test.kaleidoscope
         	        zap-cli status
         	        zap-full-scan.py -r testreport.html -t http://gothinkster.test.kaleidoscope || true
			cp /zap/wrk/testreport.html .
         	       """
			archiveArtifacts artifacts: 'testreport.html', fingerprint: true
         	   }
        	}
        }

  }
  post {
    always {
      archiveArtifacts artifacts: 'dependency-check-report.html', fingerprint: true
    }
  }
}
