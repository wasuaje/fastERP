# pull official base image
FROM node:current-alpine3.12

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
# RUN npm config set unsafe-perm true
RUN npm install -g npm@7.19.0
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
# add app
COPY . ./
# RUN chown -R node:node ./node_modules
# start app
CMD ["npm", "start"]
# CMD ["ls", "-la"]