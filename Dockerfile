FROM node:current-alpine
# Add git (required)
RUN apk add --no-cache git
# Set the Workdir, this will also create the folder if not yet existing. All following commands will be called from this folder
WORKDIR /home/node/app
# Workdir is owned by root and other users do not have access by default 
RUN chown -R node:node /home/node/app
# Switch to node, that all following commands are executed as such
USER node
# Clone repo to /home/node/app
RUN git clone https://github.com/secvisogram/csaf-validator-service.git .
# Ensure all files are owned by node
RUN chown -R node:node .
# Install as described in the Readme
RUN npm ci
# Call final command to start the service. Use Entrypoint to make sure this command is always executed and not replaced by arguments
ENTRYPOINT [ "npm", "run", "dev" ]
