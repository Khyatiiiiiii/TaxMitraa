from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

# Create Database Table
def create_table():
    conn = sqlite3.connect('tax_filing.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS tax_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT, pan TEXT, aadhaar TEXT, dob TEXT,
        email TEXT, mobile TEXT, salary_income REAL,
        business_income REAL, capital_gains REAL, rental_income REAL,
        other_income REAL, section_80c REAL, section_80d REAL, hra REAL,
        home_loan REAL, other_investments REAL, advance_tax REAL,
        bank_account TEXT, tax_regime TEXT
    )''')
    conn.commit()
    conn.close()

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = (
        request.form['full_name'], request.form['pan'], request.form['aadhaar'],
        request.form['dob'], request.form['email'], request.form['mobile'],
        request.form['salary_income'], request.form['business_income'], 
        request.form['capital_gains'], request.form['rental_income'], 
        request.form['other_income'], request.form['section_80c'], 
        request.form['section_80d'], request.form['hra'], request.form['home_loan'], 
        request.form['other_investments'], request.form['advance_tax'], 
        request.form['bank_account'], request.form['tax_regime']
    )

    conn = sqlite3.connect('tax_filing.db')
    c = conn.cursor()
    c.execute('''INSERT INTO tax_data 
        (full_name, pan, aadhaar, dob, email, mobile, salary_income, 
        business_income, capital_gains, rental_income, other_income, 
        section_80c, section_80d, hra, home_loan, other_investments, 
        advance_tax, bank_account, tax_regime) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', data)
    conn.commit()
    conn.close()

    return redirect('/success')

@app.route('/success')
def success():
    return render_template('success.html')

if __name__ == '__main__':
    create_table()
    app.run(debug=True)
