from flask import Flask

api = Flask(__name__)

@api.route('/profile')

##if __name__ =='__main__':
##  app.run(host="0.0.0.0", port=8500, debug = True)

def my_profile():
    response_body = {
        "name": "Nagato",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }
    
    #with open(r"/home/pi/average.txt", 'r') as file_handle: #READS THE WEIGHT OF THE FOOD
    with open(r"C:\Users\inika\OneDrive\Desktop\average.txt.txt", 'r') as file_handle:
        raw_data = file_handle.read().strip()  # Read the contents and remove leading/trailing whitespaces
        response_body['weight'] = float(raw_data) 
    
    #with open(r"/home/pi/label_output.txt", 'r') as file_handle: #READS THE LABEL FOR FOOD
    with open(r"C:\Users\inika\OneDrive\Desktop\label_ouput.txt.txt", 'r') as file_handle:
        raw_data = file_handle.read().strip()  # Read the contents and remove leading/trailing whitespaces
        response_body['label'] = str(raw_data)   

    return response_body

