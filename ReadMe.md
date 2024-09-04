
## Running the Application

### Development

To start the application in development mode with live reloading:

```bash
npm run dev
```

This command will use `nodemon` to monitor changes in your files and automatically restart the server.

### Production

To start the application in production mode:

```bash
npm start
```

This will run the application using Node.js with your `loader.cjs` file, which loads the ES Module (`app.mjs`) in a CommonJS environment.

## Project Structure

- **app.mjs**: Main application file.
- **loader.cjs**: CommonJS loader for the ES Module. (Only for Production)
- **views/**: Pug templates for the app's views.
- **public/**: Static assets like CSS, JavaScript, images.
- **routes/**: Define the application's routes.