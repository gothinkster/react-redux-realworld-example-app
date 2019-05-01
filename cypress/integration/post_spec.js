describe('Post', () => {
  it('Shuld create a new post', () => {
    cy.server();
    cy.visit('/editor', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });
    cy.route('POST', /.*\/api\/articles/, {
      article: {
        title: 'Onea eha',
        slug: 'onea-eha-w4qelc',
        body:
          'Fecfornak ero fu nunwebdan maf zinumunas zuwwepfup dili susit jij ikguh vagugkim defu ka ozmu. Pojoco peehmic tuc gisciel ceh se as dara sujaopa vorbe goh vicrifi cistud cigaz feilno. Jihagke rifzu atimur pamum puf fobhe gih ekug erlulag av lolari moedkuw nolvo. Uksato cujinsil tu zacref agir wipodkef ate seg icega zum jenfo wil ne eco zeurci alato. Ramdebuj rizja wocig ucu rabe sopewa nip jej gi kaju fo wembul ocmib.',
        createdAt: '2018-10-13T18:20:22.858Z',
        updatedAt: '2018-10-13T18:20:22.858Z',
        tagList: [],
        description: 'AtpnC',
        author: {
          username: 'Amettnm',
          bio: null,
          image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
          following: false
        },
        favorited: false,
        favoritesCount: 0
      }
    }).as('postArticle');

    cy.get('input[placeholder="Article Title"]').type('Onea eha');
    cy.get('input[placeholder="What\'s this article about?"]').type('AtpnC');
    cy.get('textarea[placeholder="Write your article (in markdown)"]').type(
      'Fecfornak ero fu nunwebdan maf zinumunas zuwwepfup dili susit jij ikguh vagugkim defu ka ozmu. Pojoco peehmic tuc gisciel ceh se as dara sujaopa vorbe goh vicrifi cistud cigaz feilno. Jihagke rifzu atimur pamum puf fobhe gih ekug erlulag av lolari moedkuw nolvo. Uksato cujinsil tu zacref agir wipodkef ate seg icega zum jenfo wil ne eco zeurci alato. Ramdebuj rizja wocig ucu rabe sopewa nip jej gi kaju fo wembul ocmib.'
    );
    cy.get('input[placeholder="Enter tags"]').type('Aup, lorem');
  });
});
