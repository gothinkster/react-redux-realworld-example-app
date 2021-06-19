/// <reference types="cypress" />

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const faker = require('faker');
const fetch = require('node-fetch');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  require('@cypress/code-coverage/task')(on, config);

  on('task', {
    async createUserWithArticle({
      username = faker.internet.userName(),
      email = faker.internet.exampleEmail(),
      password = 'Pa$$w0rd!',
      followUser = false,
    }) {
      let user = { username: username.substr(-20), email, password };
      let article = {
        title: faker.lorem.words(),
        description: faker.lorem.sentences(),
        body: faker.fake(`![{{lorem.words}}]({{image.city}})
  
  > {{lorem.sentence}}
  
  -----
  
  ## {{lorem.text}}
  
  {{lorem.paragraph}}
  
  - _{{lorem.word}}_
  - _{{lorem.word}}_
  - _{{lorem.word}}_
  
  ### {{lorem.text}}
  
  {{lorem.paragraph}}
  
  1. **{{lorem.words}}**
  2. **{{lorem.words}}**
  3. **{{lorem.words}}**
  
  {{lorem.paragraph}}
  
  * [x] ~{{lorem.words}}~
  * [x] ~{{lorem.words}}~
  * [ ] {{lorem.words}}
  
  > {{hacker.phrase}}
  
  \`\`\`
  <script>
    alert("{{hacker.phrase}}");
  </script>
  \`\`\`
  `),
        tagList: ['lorem ipsum', 'markdown'].concat(
          ...faker.lorem.words(5).split(' ')
        ),
      };

      // Create a new user
      user = await fetch(`${config.env.apiUrl}/users`, {
        method: 'POST',
        body: JSON.stringify({ user }),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((body) => body.user);
      // Update the user
      user = await fetch(`${config.env.apiUrl}/user`, {
        method: 'PUT',
        body: JSON.stringify({
          user: {
            bio: faker.hacker.phrase(),
            image: faker.image.avatar(),
          },
        }),
        headers: {
          'content-type': 'application/json',
          authorization: `Token ${user.token}`,
        },
      })
        .then((response) => response.json())
        .then((body) => body.user);
      // Create an article
      article = await fetch(`${config.env.apiUrl}/articles`, {
        method: 'POST',
        body: JSON.stringify({ article }),
        headers: {
          'content-type': 'application/json',
          authorization: `Token ${user.token}`,
        },
      })
        .then((response) => response.json())
        .then((body) => body.article);

      const comment = await fetch(
        `${config.env.apiUrl}/articles/${article.slug}/comments`,
        {
          method: 'POST',
          body: JSON.stringify({
            comment: {
              body: faker.lorem.text(),
            },
          }),
          headers: {
            'content-type': 'application/json',
            authorization: `Token ${user.token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((body) => body.comment);

      if (followUser) {
        const { token } = await fetch(`${config.env.apiUrl}/users/login`, {
          method: 'POST',
          body: JSON.stringify({
            user: {
              email: config.env.email,
              password: config.env.password,
            },
          }),
          headers: {
            'content-type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((body) => body.user);

        await fetch(`${config.env.apiUrl}/profiles/${username}/follow`, {
          method: 'POST',
          headers: {
            authorization: `Token ${token}`,
          },
        });
      }

      return {
        ...article,
        author: {
          ...article.author,
          ...user,
          token: undefined,
        },
        comments: [comment],
      };
    },
  });
  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};
