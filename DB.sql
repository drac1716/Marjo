-- Création de la base de données
CREATE DATABASE IF NOT EXISTS projet_marjorie;
USE projet_marjorie;

-- Table des magasins
CREATE TABLE IF NOT EXISTS magasins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

-- Table des produits
CREATE TABLE IF NOT EXISTS produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produit VARCHAR(100) NOT NULL,
    magasin_id INT NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    is_oeuf BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (magasin_id) REFERENCES magasins(id)
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_commande DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    inscription VARCHAR(100),
    nombre_parts INT NOT NULL,
    nom_client VARCHAR(100) NOT NULL,
    prenom_client VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    prix_total DECIMAL(10, 2) NOT NULL,
    statut_paiement ENUM('payé', 'acompte', 'non payé') NOT NULL,
    acompte DECIMAL(10, 2) DEFAULT 0,
    remarque TEXT
);

-- Insertion des magasins
INSERT INTO magasins (nom) VALUES
('LECLERC'),
('LIDL'),
('Netto'),
('Carrefour'),
('Intermarché'),
('Casino'),
('Grand Frais'),
('U Express');

-- Insertion des produits
INSERT INTO produits (produit, magasin_id, prix, is_oeuf) VALUES
('Beurre', 1, 9.40, FALSE),
('Farine', 2, 5.60, FALSE),
('Sucre glace', 3, 4.60, FALSE),
('Œufs', 1, 2.50, TRUE),
('Chocolat noir', 1, 7.20, FALSE),
('Sucre en poudre', 2, 4.20, FALSE),
('Lait', 4, 1.10, FALSE),
('Crème fraîche', 5, 2.80, FALSE),
('Amandes en poudre', 6, 12.50, FALSE),
('Framboises', 7, 8.90, FALSE),
('Vanille', 8, 9.75, FALSE),
('Poudre à lever', 3, 2.30, FALSE),
('Pépites de chocolat', 4, 6.40, FALSE),
('Coulis de framboise', 7, 5.20, FALSE),
('Mascarpone', 5, 3.60, FALSE);

-- Insertion des commandes
INSERT INTO commandes (date_commande, description, inscription, nombre_parts, nom_client, prenom_client, telephone, prix_total, statut_paiement, acompte, remarque) VALUES
('2025-01-15', 'Gâteau au chocolat', 'Joyeux Anniversaire', 12, 'Dupont', 'Marie', '0612345678', 45.00, 'payé', 0, 'À livrer avant 16h'),
('2025-01-20', 'Tarte aux pommes', NULL, 8, 'Martin', 'Pierre', '0789451236', 28.50, 'acompte', 15.00, 'Sans gluten'),
('2025-02-05', 'Cheesecake framboise', 'Félicitations', 10, 'Leroy', 'Sophie', '0698765432', 52.00, 'payé', 0, 'Sans sucre ajouté'),
('2025-02-14', 'Fraisier', 'Saint Valentin', 6, 'Bernard', 'Julien', '0645127896', 38.00, 'payé', 0, 'À décorer avec des cœurs'),
('2025-02-28', 'Millefeuille', NULL, 8, 'Petit', 'Lucie', '0756238945', 32.50, 'non payé', 0, 'À préparer le jour même'),
('2025-03-08', 'Tarte citron meringuée', 'Bonne fête maman', 10, 'Moreau', 'Claire', '0687954321', 42.00, 'acompte', 20.00, 'Meringue bien dorée'),
('2025-03-15', 'Opéra', NULL, 12, 'Dubois', 'Antoine', '0712345678', 56.00, 'payé', 0, 'Couper en parts égales'),
('2025-03-22', 'Éclairs au café', NULL, 15, 'Garcia', 'Élodie', '0623456789', 45.50, 'non payé', 0, 'Livraison à 14h précises'),
('2025-04-02', 'Macarons assortis', 'Bon rétablissement', 24, 'Roux', 'Michel', '0787654321', 62.00, 'payé', 0, 'Assortiment: framboise, chocolat, vanille'),
('2025-04-12', 'Forêt noire', 'Bon anniversaire Papa', 14, 'Lemoine', 'Céline', '0698761234', 48.50, 'acompte', 25.00, 'Avec des cerises fraîches'),
('2025-04-18', 'Tarte tropézienne', NULL, 10, 'Fournier', 'Thomas', '0645987632', 36.00, 'payé', 0, 'Bien généreuse sur la crème'),
('2025-04-25', 'Paris-Brest', NULL, 12, 'Girard', 'Nathalie', '0712453698', 44.00, 'non payé', 0, 'Avec des amandes effilées'),
('2025-05-05', 'Salade de fruits', NULL, 8, 'Benoit', 'Sandra', '0685321479', 25.00, 'payé', 0, 'Fruits de saison uniquement'),
('2025-05-15', 'Profiteroles', NULL, 18, 'Riviere', 'Philippe', '0798654321', 51.00, 'acompte', 30.00, 'Sauce chocolat à part'),
('2025-05-22', 'Charlotte aux fraises', 'Félicitations', 10, 'Blanc', 'Émilie', '0625879436', 40.50, 'payé', 0, 'Avec des fraises gariguettes'),
('2025-06-01', 'Tiramisu', NULL, 12, 'Meunier', 'David', '0745698231', 37.00, 'non payé', 0, 'Bien caféiné'),
('2025-06-10', 'Crumble aux pommes', NULL, 8, 'Clement', 'Laurence', '0698745632', 28.00, 'payé', 0, 'Servir tiède'),
('2025-06-18', 'Bûche chocolat-framboise', 'Bon anniversaire', 15, 'Fabre', 'Stéphane', '0612478596', 55.00, 'acompte', 20.00, 'Décorations sobres'),
('2025-06-25', 'Panna cotta vanille', NULL, 10, 'Barbier', 'Christine', '0785963214', 32.50, 'payé', 0, 'Avec coulis de fruits rouges'),
('2025-07-03', 'Mousse au chocolat', NULL, 12, 'Leroy', 'François', '0632145879', 35.00, 'non payé', 0, 'Dans des verrines individuelles'),
('2025-07-12', 'Tarte au citron', NULL, 8, 'Renaud', 'Patricia', '0725146398', 29.50, 'payé', 0, 'Zestes de citron bio'),
('2025-07-20', 'Cupcakes vanille', 'Bonne fête', 24, 'Guerin', 'Alexandre', '0687451236', 48.00, 'acompte', 25.00, 'Décorations colorées'),
('2025-07-28', 'Flan pâtissier', NULL, 12, 'Boyer', 'Sylvie', '0615987432', 33.00, 'payé', 0, 'Avec de la vanille bourbon'),
('2025-08-05', 'Clafoutis aux cerises', NULL, 10, 'Chevalier', 'Dominique', '0796321458', 31.50, 'non payé', 0, 'Avec des cerises dénoyautées'),
('2025-08-15', 'Madeleines', NULL, 30, 'Fleury', 'Gérard', '0623547891', 42.00, 'payé', 0, 'Bien bombées'),
('2025-08-22', 'Financiers', NULL, 25, 'Perrin', 'Corinne', '0741852963', 38.50, 'acompte', 15.00, 'Aux amandes'),
('2025-08-30', 'Cookies', NULL, 20, 'Marie', 'Nicolas', '0696314785', 36.00, 'payé', 0, 'Aux pépites de chocolat'),
('2025-09-05', 'Gâteau basque', NULL, 12, 'Dumont', 'Isabelle', '0617428693', 41.00, 'non payé', 0, 'Fourrage cerise'),
('2025-09-12', 'Kouign-amann', NULL, 10, 'Leclerc', 'Brigitte', '0784632591', 34.50, 'payé', 0, 'Bien caramélisé'),
('2025-09-20', 'Tarte tatin', NULL, 8, 'Rousseau', 'Patrick', '0629873451', 37.00, 'acompte', 18.00, 'Avec de la cannelle');

-- Vérification du contenu des tables
SELECT 'Magasins' AS Table_Name, COUNT(*) AS Count FROM magasins
UNION ALL
SELECT 'Produits', COUNT(*) FROM produits
UNION ALL
SELECT 'Commandes', COUNT(*) FROM commandes;