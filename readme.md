# **Description**

Svelte frontend for beerconomy

## **URL**

<https://beerconomy-frontend.onrender.com>

## **Usage**

### No Account

- The map will load on first entry, pick a a place to see its details.
- View the reviews for each place.

### Account

- Click a marker to load a place.
- Click "Review" to leave a review.
- You can also access your profile page to update your picture or see all your reviews.
- Like Reviews

## Known Issues

### No Data Loading when first visiting

One possible reason this happens is chrome / mozilla blocking the api calls because the SSL cert is self signed.

To confirm this is the issue:

- Open the develope console and check for error messages containing "err_cert_authority_invalid"

To resolve:

- Copy and paste one of the endpoints into your browser and go to the link directly
- Allow the connection.
- Return to <https://beerconomy-frontend.onrender.com/>

## Sources

| Source                                                                                                   | Description                                                          |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| <https://github.com/ItalyPaleAle/svelte-spa-router/blob/master/Advanced%20Usage.md#route-pre-conditions> | How to add prechecks for routes - used to check if token has expired |


## **Tech**

### **Framework**

- Base Svelte
  
### **Logging**

- Winston

### **CSS**

- Bulma

### **Utility**

- eslint
- prettier

### **Testing**

