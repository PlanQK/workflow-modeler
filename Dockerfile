FROM node:18-alpine as builder
LABEL maintainer = "Martin Beisel <martin.beisel@iaas.uni-stuttgart.de>"
COPY "components/bpmn-q" /app
WORKDIR /app
RUN npm ci 
RUN npm run build -- --mode=production
FROM nginxinc/nginx-unprivileged:alpine
USER root
RUN rm -rf /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html
USER 101
