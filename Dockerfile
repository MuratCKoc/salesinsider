FROM ubuntu:latest
RUN apt-get update
RUN apt-get update -y
RUN apt-get install -y python3-pip python3
RUN apt-get update
COPY . /salesinsider
WORKDIR /salesinsider
RUN pip3 install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["salesinsider/app.py"]