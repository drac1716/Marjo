   // Configuration de la base de données IndexedDB
    const DB_NAME = 'ProjetMarjorieDB';
    const DB_VERSION = 1;
    const STORE_PRODUITS = 'produits';
    const STORE_MAGASINS = 'magasins';
    const STORE_COMMANDES = 'commandes';

    let db = null;
    let produits = [];
    let magasins = [];
    let commandes = [];

    // Initialisation de la base de données
    function initDatabase() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
          console.error('Erreur lors de l\'ouverture de la base de données');
          reject(request.error);
        };
        
        request.onsuccess = (event) => {
          db = event.target.result;
          console.log('Base de données ouverte avec succès');
          resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Créer le store pour les produits s'il n'existe pas
          if (!db.objectStoreNames.contains(STORE_PRODUITS)) {
            const produitStore = db.createObjectStore(STORE_PRODUITS, { keyPath: 'id', autoIncrement: true });
            produitStore.createIndex('produit', 'produit', { unique: false });
            produitStore.createIndex('magasin', 'magasin', { unique: false });
          }
          
          // Créer le store pour les magasins s'il n'existe pas
          if (!db.objectStoreNames.contains(STORE_MAGASINS)) {
            const magasinStore = db.createObjectStore(STORE_MAGASINS, { keyPath: 'id', autoIncrement: true });
            magasinStore.createIndex('nom', 'nom', { unique: true });
          }
          
          // Créer le store pour les commandes s'il n'existe pas
          if (!db.objectStoreNames.contains(STORE_COMMANDES)) {
            const commandeStore = db.createObjectStore(STORE_COMMANDES, { keyPath: 'id', autoIncrement: true });
            commandeStore.createIndex('date', 'date', { unique: false });
            commandeStore.createIndex('paiement', 'paiement', { unique: false });
          }
        };
      });
    }

    // Fonctions génériques pour les opérations CRUD
    function getAll(storeName) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    function add(storeName, data) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    function update(storeName, id, data) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put({ ...data, id });
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    function remove(storeName, id) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    // Chargement des données depuis IndexedDB
    async function chargerDonnees() {
      try {
        produits = await getAll(STORE_PRODUITS);
        magasins = await getAll(STORE_MAGASINS);
        commandes = await getAll(STORE_COMMANDES);
        
        // Si aucune donnée n'existe, initialiser avec les données par défaut
        if (produits.length === 0) {
          const produitsInit = [
            { produit: "Beurre", magasin: "LECLERC", prix: 9.4 },
            { produit: "Farine", magasin: "LIDL", prix: 5.6 },
            { produit: "Sucre glace", magasin: "Netto", prix: 4.6 },
            { produit: "Œufs", magasin: "LECLERC", prix: 2.5, isOeuf: true }
          ];
          
          for (const produit of produitsInit) {
            await add(STORE_PRODUITS, produit);
          }
          produits = await getAll(STORE_PRODUITS);
        }
        
        if (magasins.length === 0) {
          const magasinsInit = [
            { nom: "LECLERC" },
            { nom: "LIDL" },
            { nom: "Netto" }
          ];
          
          for (const magasin of magasinsInit) {
            await add(STORE_MAGASINS, magasin);
          }
          magasins = await getAll(STORE_MAGASINS);
        }
        
        if (commandes.length === 0) {
          const commandesInit = [
            { 
              date: "2025-01-15", 
              description: "Gâteau au chocolat", 
              inscription: "Joyeux Anniversaire", 
              parts: 12, 
              nom: "Dupont", 
              prenom: "Marie", 
              telephone: "06 12 34 56 78", 
              prix: 45.00, 
              paiement: "payé", 
              acompte: 0, 
              remarque: "À livrer avant 16h" 
            },
            { 
              date: "2025-01-20", 
              description: "Tarte aux pommes", 
              inscription: "", 
              parts: 8, 
              nom: "Martin", 
              prenom: "Pierre", 
              telephone: "07 89 45 12 36", 
              prix: 28.50, 
              paiement: "acompte", 
              acompte: 15.00, 
              remarque: "Sans gluten" 
            },
            { 
              date: "2025-02-05", 
              description: "Cheesecake framboise", 
              inscription: "Félicitations", 
              parts: 10, 
              nom: "Leroy", 
              prenom: "Sophie", 
              telephone: "06 98 76 54 32", 
              prix: 52.00, 
              paiement: "payé", 
              acompte: 0, 
              remarque: "Sans sucre ajouté" 
            }
          ];
          
          for (const commande of commandesInit) {
            await add(STORE_COMMANDES, commande);
          }
          commandes = await getAll(STORE_COMMANDES);
        }
        
        return true;
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return false;
      }
    }

    // Fonctions pour afficher les produits et magasins
    function afficherProduits() {
      const tbody = document.getElementById('table-utilisateurs');
      tbody.innerHTML = '';
      
      produits.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.produit}</td>
          <td>${p.magasin}</td>
          <td>${p.prix.toFixed(2)}</td>
          <td class="action-icons">
            <i class="bi bi-pencil-square text-primary" onclick="editerProduit(${p.id})"></i>
            <i class="bi bi-trash text-danger" onclick="supprimerProduit(${p.id})"></i>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
    
    function afficherMagasins() {
      const tbody = document.getElementById('table-magasins');
      tbody.innerHTML = '';
      
      magasins.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${m.nom}</td>
          <td class="action-icons">
            <i class="bi bi-pencil-square text-primary" onclick="editerMagasin(${m.id})"></i>
            <i class="bi bi-trash text-danger" onclick="supprimerMagasin(${m.id})"></i>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
    
    function remplirSelectMagasins() {
      const select = document.getElementById('magasin-produit');
      select.innerHTML = '';
      
      magasins.forEach(m => {
        const option = document.createElement('option');
        option.value = m.nom;
        option.textContent = m.nom;
        select.appendChild(option);
      });
    }
    
    async function ajouterProduit() {
      const nom = document.getElementById('nom-produit').value;
      const magasin = document.getElementById('magasin-produit').value;
      const prix = parseFloat(document.getElementById('prix-produit').value);
      
      if (!nom || !magasin || isNaN(prix)) {
        alert('Veuillez remplir tous les champs');
        return;
      }
      
      const produitData = {
        produit: nom,
        magasin: magasin,
        prix: prix
      };
      
      // Vérifier si c'est un produit d'œufs
      if (nom.toLowerCase().includes('œuf') || nom.toLowerCase().includes('oeuf')) {
        produitData.isOeuf = true;
      }
      
      try {
        await add(STORE_PRODUITS, produitData);
        produits = await getAll(STORE_PRODUITS);
        afficherProduits();
        
        // Fermer le modal et réinitialiser le formulaire
        bootstrap.Modal.getInstance(document.getElementById('modalAjout')).hide();
        document.getElementById('nom-produit').value = '';
        document.getElementById('prix-produit').value = '';
      } catch (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
        alert('Erreur lors de l\'ajout du produit');
      }
    }
    
    async function ajouterMagasin() {
      const nom = document.getElementById('nom-magasin').value;
      
      if (!nom) {
        alert('Veuillez saisir un nom de magasin');
        return;
      }
      
      try {
        await add(STORE_MAGASINS, { nom });
        magasins = await getAll(STORE_MAGASINS);
        afficherMagasins();
        remplirSelectMagasins();
        
        // Réinitialiser le champ
        document.getElementById('nom-magasin').value = '';
      } catch (error) {
        console.error('Erreur lors de l\'ajout du magasin:', error);
        alert('Erreur lors de l\'ajout du magasin');
      }
    }
    
    async function supprimerProduit(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
          await remove(STORE_PRODUITS, id);
          produits = await getAll(STORE_PRODUITS);
          afficherProduits();
        } catch (error) {
          console.error('Erreur lors de la suppression du produit:', error);
          alert('Erreur lors de la suppression du produit');
        }
      }
    }
    
    async function supprimerMagasin(id) {
      // Vérifier si le magasin est utilisé par des produits
      const produitsUtilisantMagasin = produits.filter(p => p.magasinId === id);
      
      if (produitsUtilisantMagasin.length > 0) {
        alert('Ce magasin est utilisé par des produits et ne peut pas être supprimé');
        return;
      }
      
      if (confirm('Êtes-vous sûr de vouloir supprimer ce magasin ?')) {
        try {
          await remove(STORE_MAGASINS, id);
          magasins = await getAll(STORE_MAGASINS);
          afficherMagasins();
          remplirSelectMagasins();
        } catch (error) {
          console.error('Erreur lors de la suppression du magasin:', error);
          alert('Erreur lors de la suppression du magasin');
        }
      }
    }

    // Commandes - Nouvelle fonction pour remplir le tableau
    async function remplirTableauCommandes() {
      const tbody = document.getElementById('table-commandes');
      tbody.innerHTML = '';
      
      // Trier les commandes par date (plus récentes d'abord)
      const commandesTriees = [...commandes].sort((a, b) => new Date(b.date) - new Date(a.date));
      
      commandesTriees.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = 'commande-ligne';
        tr.setAttribute('data-id', c.id);
        
        // Déterminer la classe CSS en fonction du statut de paiement
        let classePaiement = '';
        if (c.paiement === 'payé') classePaiement = 'paye';
        else if (c.paiement === 'acompte') classePaiement = 'acompte';
        else classePaiement = 'non-paye';
        
        tr.innerHTML = `
          <td>${c.date}</td>
          <td>${c.parts}</td>
          <td>${c.prix.toFixed(2)} €</td>
          <td>
            <select class="paiement-select ${classePaiement}" onchange="changerStatutPaiement(${c.id}, this.value)">
              <option value="payé" ${c.paiement === 'payé' ? 'selected' : ''}>Payé</option>
              <option value="acompte" ${c.paiement === 'acompte' ? 'selected' : ''}>Acompte</option>
              <option value="non payé" ${c.paiement === 'non payé' ? 'selected' : ''}>Non payé</option>
            </select>
          </td>
          <td>${c.paiement === 'acompte' ? c.acompte.toFixed(2) + ' €' : '-'}</td>
          <td class="action-icons">
            <i class="bi bi-pencil-square text-primary" data-bs-toggle="modal" data-bs-target="#modalCommande" onclick="editerCommande(${c.id})"></i>
            <i class="bi bi-trash text-danger" onclick="supprimerCommande(${c.id})"></i>
            <i class="bi bi-info-circle text-info" onclick="toggleDetailsCommande(${c.id})"></i>
          </td>
        `;
        tbody.appendChild(tr);
        
        // Ajouter la ligne de détails
        const trDetails = document.createElement('tr');
        trDetails.className = 'commande-details';
        trDetails.id = `details-${c.id}`;
        trDetails.innerHTML = `
          <td colspan="6">
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Description</div>
                <div class="detail-value">${c.description}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Inscription</div>
                <div class="detail-value">${c.inscription || 'Aucune'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Client</div>
                <div class="detail-value">${c.prenom} ${c.nom}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Téléphone</div>
                <div class="detail-value">${c.telephone}</div>
              </div>
              ${c.remarque ? `
              <div class="detail-item">
                <div class="detail-label">Remarques</div>
                <div class="detail-value">${c.remarque}</div>
              </div>
              ` : ''}
            </div>
          </td>
        `;
        tbody.appendChild(trDetails);
      });
      
      // Mettre à jour les statistiques
      afficherStatsMensuelles();
      afficherCommandesMoisCours();
      afficherCommandesAutres();
    }
    
    function toggleDetailsCommande(id) {
      const details = document.getElementById(`details-${id}`);
      const ligne = document.querySelector(`.commande-ligne[data-id="${id}"]`);
      
      if (details.style.display === 'table-row') {
        details.style.display = 'none';
        ligne.classList.remove('commande-expanded');
      } else {
        // Masquer tous les autres détails
        document.querySelectorAll('.commande-details').forEach(d => {
          d.style.display = 'none';
        });
        document.querySelectorAll('.commande-ligne').forEach(l => {
          l.classList.remove('commande-expanded');
        });
        
        // Afficher les détails de cette commande
        details.style.display = 'table-row';
        ligne.classList.add('commande-expanded');
      }
    }
    
    async function changerStatutPaiement(id, nouveauStatut) {
      const commande = commandes.find(c => c.id === id);
      if (!commande) return;
      
      try {
        await update(STORE_COMMANDES, id, {
          ...commande,
          paiement: nouveauStatut
        });
        
        // Recharger les commandes
        commandes = await getAll(STORE_COMMANDES);
        remplirTableauCommandes();
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de paiement:', error);
        alert('Erreur lors de la mise à jour du statut de paiement');
      }
    }
    
    async function ajouterCommande() {
      const date = document.getElementById('commande-date').value;
      const description = document.getElementById('commande-description').value;
      const inscription = document.getElementById('commande-inscription').value;
      const parts = parseInt(document.getElementById('commande-parts').value);
      const nom = document.getElementById('commande-nom').value;
      const prenom = document.getElementById('commande-prenom').value;
      const telephone = document.getElementById('commande-telephone').value;
      const prix = parseFloat(document.getElementById('commande-prix').value);
      const paiement = document.getElementById('commande-paiement').value;
      const acompte = parseFloat(document.getElementById('commande-acompte').value);
      const remarque = document.getElementById('commande-remarque').value;
      
      if (!date || !description || !nom || !prenom || !telephone || !parts ) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      const commandeData = {
        date,
        description,
        inscription,
        parts,
        nom,
        prenom,
        telephone,
        prix,
        paiement,
        acompte: paiement === 'acompte' ? acompte : 0,
        remarque
      };
      
      try {
        await add(STORE_COMMANDES, commandeData);
        commandes = await getAll(STORE_COMMANDES);
        remplirTableauCommandes();
        
        // Fermer le modal et réinitialiser le formulaire
        bootstrap.Modal.getInstance(document.getElementById('modalCommande')).hide();
        document.getElementById('commande-form').reset();
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la commande:', error);
        alert('Erreur lors de l\'ajout de la commande');
      }
    }
    
    async function editerCommande(id) {
      const commande = commandes.find(c => c.id === id);
      if (!commande) return;
      
      // Remplir le formulaire avec les données de la commande
      document.getElementById('commande-id').value = id;
      document.getElementById('commande-date').value = commande.date;
      document.getElementById('commande-description').value = commande.description;
      document.getElementById('commande-inscription').value = commande.inscription || '';
      document.getElementById('commande-parts').value = commande.parts;
      document.getElementById('commande-nom').value = commande.nom;
      document.getElementById('commande-prenom').value = commande.prenom;
      document.getElementById('commande-telephone').value = commande.telephone;
      document.getElementById('commande-prix').value = commande.prix;
      document.getElementById('commande-paiement').value = commande.paiement;
      document.getElementById('commande-acompte').value = commande.acompte || 0;
      document.getElementById('commande-remarque').value = commande.remarque || '';
      
      // Changer le titre du modal
      document.getElementById('modalCommandeTitre').textContent = 'Modifier la commande';
      
      // Changer le comportement du bouton Enregistrer
      const btnEnregistrer = document.getElementById('btnEnregistrerCommande');
      btnEnregistrer.textContent = 'Modifier';
      btnEnregistrer.onclick = async () => {
        const date = document.getElementById('commande-date').value;
        const description = document.getElementById('commande-description').value;
        const inscription = document.getElementById('commande-inscription').value;
        const parts = parseInt(document.getElementById('commande-parts').value);
        const nom = document.getElementById('commande-nom').value;
        const prenom = document.getElementById('commande-prenom').value;
        const telephone = document.getElementById('commande-telephone').value;
        const prix = parseFloat(document.getElementById('commande-prix').value);
        const paiement = document.getElementById('commande-paiement').value;
        const acompte = parseFloat(document.getElementById('commande-acompte').value);
        const remarque = document.getElementById('commande-remarque').value;
        
        if (!date || !description || !nom || !prenom || !telephone || isNaN(prix) || !paiement) {
          alert('Veuillez remplir tous les champs obligatoires');
          return;
        }
        
        try {
          await update(STORE_COMMANDES, id, {
            date,
            description,
            inscription,
            parts,
            nom,
            prenom,
            telephone,
            prix,
            paiement,
            acompte: paiement === 'acompte' ? acompte : 0,
            remarque
          });
          
          commandes = await getAll(STORE_COMMANDES);
          remplirTableauCommandes();
          
          // Fermer le modal et réinitialiser le formulaire
          bootstrap.Modal.getInstance(document.getElementById('modalCommande')).hide();
          document.getElementById('commande-form').reset();
          
          // Restaurer le comportement par défaut du bouton
          btnEnregistrer.textContent = 'Enregistrer';
          btnEnregistrer.onclick = ajouterCommande;
          document.getElementById('modalCommandeTitre').textContent = 'Ajouter une commande';
        } catch (error) {
          console.error('Erreur lors de la modification de la commande:', error);
          alert('Erreur lors de la modification de la commande');
        }
      };
    }
    
    async function supprimerCommande(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        try {
          await remove(STORE_COMMANDES, id);
          commandes = await getAll(STORE_COMMANDES);
          remplirTableauCommandes();
        } catch (error) {
          console.error('Erreur lors de la suppression de la commande:', error);
          alert('Erreur lors de la suppression de la commande');
        }
      }
    }
    
    function afficherStatsMensuelles() {
      const container = document.getElementById('stats-mensuelles');
      container.innerHTML = '';
      
      // Regrouper les commandes par mois
      const revenusParMois = {};
      const moisLabels = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      
      commandes.forEach(c => {
        const date = new Date(c.date);
        const mois = date.getMonth(); // 0-11
        const annee = date.getFullYear();
        
        if (annee === 2025) {
          if (!revenusParMois[mois]) {
            revenusParMois[mois] = 0;
          }
          revenusParMois[mois] += c.prix;
        }
      });
      
      // Afficher les statistiques pour chaque mois
      for (let i = 0; i < 12; i++) {
        const revenu = revenusParMois[i] || 0;
        
        const col = document.createElement('div');
        col.className = 'col-md-3 mb-3';
        col.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title stats-month">${moisLabels[i]}</h5>
              <p class="card-text stats-amount">${revenu.toFixed(2)} €</p>
            </div>
          </div>
        `;
        
        container.appendChild(col);
      }
    }
    
    function afficherCommandesMoisCours() {
      const container = document.getElementById('commandes-mois-cours');
      container.innerHTML = '';
      
      // Obtenir le mois en cours (Septembre 2025)
      const moisCours = 8; // Septembre (0-indexed)
      
      // Filtrer les commandes du mois en cours
      const commandesMoisCours = commandes.filter(c => {
        const date = new Date(c.date);
        return date.getMonth() === moisCours && date.getFullYear() === 2025;
      });
      
      if (commandesMoisCours.length === 0) {
        container.innerHTML = '<p class="text-center">Aucune commande pour le mois en cours</p>';
        return;
      }
      
      // Afficher les commandes du mois en cours
      commandesMoisCours.forEach(c => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        // Déterminer la classe de badge en fonction du statut de paiement
        let badgeClass = '';
        if (c.paiement === 'payé') badgeClass = 'bg-success';
        else if (c.paiement === 'acompte') badgeClass = 'bg-warning';
        else badgeClass = 'bg-danger';
        
        col.innerHTML = `
          <div class="card card-commande h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="card-title mb-0">${c.description}</h5>
                <span class="badge ${badgeClass}">${c.paiement}</span>
              </div>
              <h6 class="card-subtitle mb-2 text-muted">${c.date}</h6>
              <p class="card-text">
                <strong>Client:</strong> ${c.prenom} ${c.nom}<br>
                <strong>Parts:</strong> ${c.parts}<br>
                <strong>Prix:</strong> ${c.prix.toFixed(2)} €<br>
                ${c.acompte > 0 ? `<strong>Acompte:</strong> ${c.acompte.toFixed(2)} €<br>` : ''}
                ${c.inscription ? `<strong>Inscription:</strong> ${c.inscription}<br>` : ''}
              </p>
            </div>
            <div class="card-footer bg-transparent">
              <small class="text-muted">Tél: ${c.telephone}</small>
            </div>
          </div>
        `;
        
        container.appendChild(col);
      });
    }
    
    function afficherCommandesAutres() {
      const container = document.getElementById('commandes-autres');
      container.innerHTML = '';
      
      // Obtenir le mois en cours (Septembre 2025)
      const moisCours = 8; // Septembre (0-indexed)
      
      // Filtrer les commandes des autres mois
      const commandesAutres = commandes.filter(c => {
        const date = new Date(c.date);
        return date.getMonth() !== moisCours && date.getFullYear() === 2025;
      });
      
      if (commandesAutres.length === 0) {
        container.innerHTML = '<p class="text-center">Aucune autre commande</p>';
        return;
      }
      
      // Afficher les commandes des autres mois
      commandesAutres.forEach(c => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        // Déterminer la classe de badge en fonction du statut de paiement
        let badgeClass = '';
        if (c.paiement === 'payé') badgeClass = 'bg-success';
        else if (c.paiement === 'acompte') badgeClass = 'bg-warning';
        else badgeClass = 'bg-danger';
        
        col.innerHTML = `
          <div class="card card-commande h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="card-title mb-0">${c.description}</h5>
                <span class="badge ${badgeClass}">${c.paiement}</span>
              </div>
              <h6 class="card-subtitle mb-2 text-muted">${c.date}</h6>
              <p class="card-text">
                <strong>Client:</strong> ${c.prenom} ${c.nom}<br>
                <strong>Parts:</strong> ${c.parts}<br>
                <strong>Prix:</strong> ${c.prix.toFixed(2)} €<br>
                ${c.acompte > 0 ? `<strong>Acompte:</strong> ${c.acompte.toFixed(2)} €<br>` : ''}
                ${c.inscription ? `<strong>Inscription:</strong> ${c.inscription}<br>` : ''}
              </p>
            </div>
            <div class="card-footer bg-transparent">
              <small class="text-muted">Tél: ${c.telephone}</small>
            </div>
          </div>
        `;
        
        container.appendChild(col);
      });
    }

    // Fonction pour afficher le contenu sélectionné
    function showContent(contentId, element) {
      // Masquer tous les contenus
      document.querySelectorAll('main > div').forEach(div => {
        div.classList.add('d-none');
      });
      
      // Afficher le contenu sélectionné
      document.getElementById(contentId).classList.remove('d-none');
      
      // Mettre à jour la classe active dans la navigation
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      element.classList.add('active');
      
      // Charger les données spécifiques si nécessaire
      if (contentId === 'profil') {
        afficherProduits();
      } else if (contentId === 'contact') {
        remplirTableauCommandes();
      }
    }

    // Simulation de coût de recette
    function ajouterLigneSimulateur() {
      const container = document.getElementById('simulateur-container');
      const ligne = document.createElement('div');
      ligne.className = 'row g-3 mb-2';
      ligne.innerHTML = `
        <div class="col-md-3">
          <select class="form-control produit-select" onchange="verifierOeuf(this)">
            <option value="">Sélectionner un produit</option>
            ${produits.map(p => `<option value="${p.id}" data-prix="${p.prix}" data-isoeuf="${p.isOeuf || false}">${p.produit}</option>`).join('')}
          </select>
        </div>
        <div class="col-md-3">
          <input type="text" class="form-control magasin-input" readonly>
        </div>
        <div class="col-md-2">
          <input type="number" step="0.01" class="form-control prix-input" readonly>
        </div>
        <div class="col-md-3">
          <input type="number" class="form-control quantite-input" placeholder="Quantité (g)" oninput="calculerCoutTotal()">
        </div>
        <div class="col-md-1">
          <i class="bi bi-trash text-danger" onclick="supprimerLigneSimulateur(this)" style="cursor: pointer; line-height: 38px;"></i>
        </div>
      `;
      container.appendChild(ligne);
    }
    
    function supprimerLigneSimulateur(element) {
      element.closest('.row').remove();
      calculerCoutTotal();
    }
    
    function verifierOeuf(select) {
      const selectedOption = select.options[select.selectedIndex];
      const isOeuf = selectedOption.getAttribute('data-isoeuf') === 'true';
      const prix = parseFloat(selectedOption.getAttribute('data-prix'));
      
      const ligne = select.closest('.row');
      ligne.querySelector('.magasin-input').value = produits.find(p => p.id === parseInt(select.value))?.magasin || '';
      ligne.querySelector('.prix-input').value = prix.toFixed(2);
      
      // Afficher une indication si c'est un produit d'œufs
      if (isOeuf) {
        ligne.querySelector('.quantite-input').placeholder = 'Quantité (œufs)';
      } else {
        ligne.querySelector('.quantite-input').placeholder = 'Quantité (g)';
      }
      
      calculerCoutTotal();
    }
    
    function calculerCoutTotal() {
      let total = 0;
      
      document.querySelectorAll('#simulateur-container .row').forEach(ligne => {
        const select = ligne.querySelector('.produit-select');
        const quantiteInput = ligne.querySelector('.quantite-input');
        
        if (select.value && quantiteInput.value) {
          const selectedOption = select.options[select.selectedIndex];
          const prix = parseFloat(selectedOption.getAttribute('data-prix'));
          const isOeuf = selectedOption.getAttribute('data-isoeuf') === 'true';
          const quantite = parseFloat(quantiteInput.value);
          
          if (isOeuf) {
            // Pour les œufs, le prix est pour 10 œufs
            total += (prix / 10) * quantite;
          } else {
            // Pour les autres produits, le prix est au kg
            total += (prix / 1000) * quantite;
          }
        }
      });
      
      document.getElementById('prix-total').textContent = total.toFixed(2) + ' €';
    }

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Initialiser la base de données
    await initDatabase();
    
    // Charger les données
    await chargerDonnees();
    
    // Remplir les sélecteurs de magasins
    remplirSelectMagasins();
    
    // Afficher les produits (pour l'onglet Matières premières)
    afficherProduits();
    
    // Afficher les magasins (pour le modal de gestion des magasins)
    afficherMagasins();
    
    // Remplir le tableau des commandes
    remplirTableauCommandes();
    
    // Ajouter les écouteurs d'événements
    document.getElementById('btnAjouterProduit').addEventListener('click', ajouterProduit);
    document.getElementById('btnAjouterMagasin').addEventListener('click', ajouterMagasin);
    document.getElementById('btnEnregistrerCommande').addEventListener('click', ajouterCommande);
    
    // Écouteur pour détecter les produits d'œufs
    document.getElementById('nom-produit').addEventListener('input', function() {
      const nom = this.value.toLowerCase();
      const indication = document.getElementById('oeuf-indication');
      
      if (nom.includes('œuf') || nom.includes('oeuf')) {
        indication.style.display = 'block';
      } else {
        indication.style.display = 'none';
      }
    });
    
    // Ajouter une ligne initiale au simulateur
    ajouterLigneSimulateur();
    
    console.log('Application initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error);
    alert('Erreur lors de l\'initialisation de l\'application');
  }

});
