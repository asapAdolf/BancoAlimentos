from app import create_app

app = create_app()

if __name__ == '__main__':
    # debug=True recarga el servidor al guardar cambios. Solo para desarrollo.
    app.run(debug=True, port=5000)
