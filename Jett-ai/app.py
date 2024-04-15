from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__)

# Set your OpenAI API key
openai.api_key = 'api-key'
model_name = 'gpt-3.5-turbo'

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/ask', methods=['POST'])
def ask():
    question = request.form['question']
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content":question}]
    )
    answer = response.choices[0].message.content.strip()
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
