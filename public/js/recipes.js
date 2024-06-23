document.addEventListener('DOMContentLoaded', () => {
    const recipeList = document.getElementById('recipe-list');
    const recipeForm = document.getElementById('recipe-form');
    const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
    const addRecipeBtn = document.getElementById('add-recipe-btn');
    const errorAlert = document.getElementById('error');
    const successAlert = document.getElementById('success');
    let editing = false;

    const fetchRecipes = async () => {
        const response = await fetch('/api/receitas');
        const data = await response.json();
        if (data.status === 'success') {
            recipeList.innerHTML = '';
            data.data.forEach(recipe => {
                const recipeItem = document.createElement('div');
                recipeItem.className = 'card my-2';
                recipeItem.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${recipe.nome}</h5>
                        <p class="card-text">${recipe.descricao}</p>
                        <p class="card-text"><strong>Ingredientes:</strong> ${recipe.ingredientes}</p>
                        <button class="btn btn-warning edit-btn" data-id="${recipe.id}">Editar</button>
                        <button class="btn btn-danger delete-btn" data-id="${recipe.id}">Excluir</button>
                    </div>
                `;
                recipeList.appendChild(recipeItem);
            });
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            id: document.getElementById('recipe-id').value,
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            ingredientes: document.getElementById('ingredientes').value
        };
        let url = '/api/receitas';
        let method = 'POST';
        if (editing) {
            method = 'PUT';
        }
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.status === 'success') {
            successAlert.textContent = data.message;
            successAlert.style.display = 'block';
            setTimeout(() => {
                successAlert.style.display = 'none';
                modal.hide();
                fetchRecipes();
            }, 2000);
        } else {
            errorAlert.textContent = data.message;
            errorAlert.style.display = 'block';
        }
    };

    const handleEditClick = (event) => {
        if (event.target.classList.contains('edit-btn')) {
            editing = true;
            const recipeId = event.target.dataset.id;
            const recipe = event.target.closest('.card').querySelector('.card-title').textContent;
            const description = event.target.closest('.card').querySelector('.card-text').textContent;
            const ingredients = event.target.closest('.card').querySelector('.card-text strong').nextSibling.textContent;
            document.getElementById('recipe-id').value = recipeId;
            document.getElementById('nome').value = recipe;
            document.getElementById('descricao').value = description;
            document.getElementById('ingredientes').value = ingredients;
            modal.show();
        }
    };

    const handleDeleteClick = async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const recipeId = event.target.dataset.id;
            const response = await fetch('/api/receitas', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: recipeId })
            });
            const data = await response.json();
            if (data.status === 'success') {
                successAlert.textContent = data.message;
                successAlert.style.display = 'block';
                setTimeout(() => {
                    successAlert.style.display = 'none';
                    fetchRecipes();
                }, 2000);
            }
        }
    };

    addRecipeBtn.addEventListener('click', () => {
        editing = false;
        document.getElementById('recipe-form').reset();
        modal.show();
    });

    recipeForm.addEventListener('submit', handleFormSubmit);
    recipeList.addEventListener('click', handleEditClick);
    recipeList.addEventListener('click', handleDeleteClick);

    fetchRecipes();
});
