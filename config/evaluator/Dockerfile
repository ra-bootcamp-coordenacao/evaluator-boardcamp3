FROM cypress/browsers:node16.16.0-chrome105-ff99-edge

WORKDIR /evaluator
COPY ./evaluator/package*.json ./
RUN npm install

COPY ./evaluator .


CMD ["npm", "run", "report"]