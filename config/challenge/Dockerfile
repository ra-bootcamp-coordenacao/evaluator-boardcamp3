FROM node:16.17

WORKDIR /challenge
COPY ./challenge/package*.json ./
RUN npm install

COPY ./evaluator/config/challenge/resilient-runner.sh ./resilient-runner.sh
COPY ./evaluator/config/challenge/entrypoint.sh ./entrypoint.sh
COPY ./evaluator/config/challenge/wait-for-it.sh ./wait-for-it.sh

RUN chmod +x ./wait-for-it.sh ./entrypoint.sh ./resilient-runner.sh
# RUN chmod +x ./resilient-runner.sh

COPY ./challenge .

ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "./resilient-runner.sh" ]