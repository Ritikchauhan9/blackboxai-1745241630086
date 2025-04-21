
Built by https://www.blackbox.ai

---

```markdown
# SafeCrypt - Secure Encryption Tool

## Project Overview
SafeCrypt is a web-based tool designed for secure encryption and decryption of different types of data such as text, links, phone numbers, and passwords. Built with modern web technologies, it provides an intuitive interface and utilizes strong encryption algorithms to ensure the safety of sensitive information.

## Installation
To run SafeCrypt locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/safecrypt.git
   cd safecrypt
   ```

2. **Open `index.html`** in your preferred web browser. There is no additional configuration or server setup required, as it operates directly within the browser.

## Usage
1. **Select the Type of Data**: Choose from the options provided (Text, Link, Phone, Password) to specify what type of data you want to encrypt or decrypt.
2. **Input the Data**: Enter the data into the provided input fields.
3. **Provide a Secret Key** (optional): For added security, you may enter a secret key that will be used during the encryption and decryption process.
4. **Encrypt/Decrypt**: Click the respective buttons to encrypt or decrypt the data. The results will be displayed below the input fields, along with an option to copy the result to the clipboard.
5. **History**: You can save and view the encryption/decryption history by clicking on the "History" button. You will be prompted to set or enter a password for accessing the history.

## Features
- **Multiple Data Types**: Supports encryption and decryption for textual data, links, phone numbers, and passwords.
- **Secure Encryption**: Uses AES encryption with SHA-256 hashing for secret key generation.
- **History Management**: Stores a history of your encryption and decryption activities, secured by an optional password.
- **User-Friendly Interface**: Built with Tailwind CSS for a responsive and modern design.

## Dependencies
This project makes use of the following libraries:
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Font Awesome](https://fontawesome.com/) for icons
- [CryptoJS](https://cryptojs.gitbook.io/docs/) for cryptographic functions

The libraries are included via CDN links in the `index.html` file.

## Project Structure
The project consists of the following files:

```
/safecrypt
│
├── index.html            # Main HTML file containing the UI
├── main.js               # JavaScript file with encryption logic and event handling
└── README.md             # Project documentation
```

### File descriptions:
- **index.html**: The HTML structure of the SafeCrypt application, containing user interface elements and references to styles and scripts.
- **main.js**: The main JavaScript file handling the application logic, including encryption/decryption processes and history management.

## Contributing
Contributions are welcome! If you find a bug or want to add a new feature, feel free to fork the repository and create a pull request.

## License
This project is licensed under the MIT License.

---

For any further questions or issues, please open an issue on the repository or reach out directly.
```