import path from "path";

// Sometimes we need a delay between making a change, and testing it, otherwise the AngularJS changes are missed
let waitTime = 250;

describe('live visualisation', () => {
  before(() => {
    // Seed data
    cy.request('/x/test/seed')
  })

  // Save a visualisation
  it('save a visualisation using non-default name', () => {
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="sqltab"]').click()
    cy.get('[data-cy="usersqltext"]').type(
      'SELECT table1.Name, table2.value\n' +
      'FROM table1 JOIN table2\n' +
      'ON table1.id = table2.id\n' +
      'ORDER BY table1.id')
    cy.get('[data-cy="nameinput"]').type('{selectall}{backspace}').type('livetest1')
    cy.get('[data-cy="savebtn"]').click()
    cy.get('[data-cy="statusmsg"]').should('contain.text', 'Visualisation \'livetest1\' saved')

    // Verify the visualisation - it should be automatically selected in the drop down list as it's the only one
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="selectedvis"]').should('contain.text', 'livetest1')
  })

  // Check if 'default' visualisation is still chosen by default even when created after non-default ones
  it('save a visualisation using default name', () => {
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="sqltab"]').click()
    cy.get('[data-cy="usersqltext"]').type('{selectall}{backspace}').type(
      'SELECT table1.Name, table2.value\n' +
      'FROM table1 JOIN table2\n' +
      'USING (id)\n' +
      'ORDER BY table1.id')
    cy.get('[data-cy="nameinput"]').type('{selectall}{backspace}').type('default')
    cy.get('[data-cy="savebtn"]').click()
    cy.get('[data-cy="statusmsg"]').should('contain.text', 'Visualisation \'default\' saved')

    // Verify the visualisation - it should be automatically selected in the drop down list as it's the default
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="selectedvis"]').should('contain.text', 'default')
    cy.get('[data-cy="usersqltext"]').should('contain.text',
      'SELECT table1.Name, table2.value\n' +
      'FROM table1 JOIN table2\n' +
      'USING (id)\n' +
      'ORDER BY table1.id')
  })

  // Save a visualisation
  it('save a visualisation with name alphabetically lower than \'default\'', () => {
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="sqltab"]').click()
    cy.get('[data-cy="usersqltext"]').type('{selectall}{backspace}').type(
      'SELECT table1.Name, table2.value\n' +
      'FROM table1, table2\n' +
      'WHERE table1.id = table2.id\n' +
      'ORDER BY table2.value;')
    cy.get('[data-cy="nameinput"]').type('{selectall}{backspace}').type('abc')
    cy.get('[data-cy="savebtn"]').click()
    cy.get('[data-cy="statusmsg"]').should('contain.text', 'Visualisation \'abc\' saved')

    // Check that the visualisation is present, but not automatically selected when the page loads
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="selectedvis"]').should('not.contain.text', 'abc')
  })

  // Save over an existing visualisation
  it('save over an existing visualisation', () => {
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="sqltab"]').click()
    cy.get('[data-cy="usersqltext"]').type('{selectall}{backspace}').type(
      'SELECT table1.Name, table2.value\n' +
      'FROM table1, table2\n' +
      'WHERE table1.id = table2.id\n' +
      'ORDER BY table1.id;')
    cy.get('[data-cy="nameinput"]').type('{selectall}{backspace}').type('livetest1')
    cy.get('[data-cy="savebtn"]').click()
    cy.get('[data-cy="statusmsg"]').should('contain.text', 'Visualisation \'livetest1\' saved')

    // Verify the new visualisation text
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-livetest1"]').click()
    cy.get('[data-cy="usersqltext"]').should('contain',
      'SELECT table1.Name, table2.value\n' +
      'FROM table1, table2\n' +
      'WHERE table1.id = table2.id\n' +
      'ORDER BY table1.id;')
  })

  // * Chart settings tab *

  // Chart type drop down
  it('chart type drop down', () => {
    // Start with the existing "livetest1" visualisation
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-livetest1"]').click()

    // Switch to the chart settings tab
    cy.get('[data-cy="charttab"]').click()

    // Change the chart type
    cy.get('[data-cy="chartdropdown"]').click()
    cy.get('[data-cy="chartpie"]').click()

    // Verify the change
    cy.wait(waitTime)
    cy.get('[data-cy="charttype"]').should('contain', 'Pie chart')
    cy.get('[data-cy="showxaxis"]').should('not.exist')

    // Switch to a different chart type
    cy.get('[data-cy="chartdropdown"]').click()
    cy.get('[data-cy="charthbc"]').click()

    // Verify the change
    cy.wait(waitTime)
    cy.get('[data-cy="charttype"]').should('contain', 'Horizontal bar chart')
    cy.get('[data-cy="showxaxis"]').should('exist')
  })

  // X axis column drop down
  it('X axis column drop down', () => {
    // Start with the existing "livetest1" visualisation
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-livetest1"]').click()

    // Switch to the chart settings tab
    cy.get('[data-cy="charttab"]').click()

    // Change the X axis column value
    cy.get('[data-cy="xaxisdropdown"]').click()
    cy.get('[data-cy="xcol-value"]').click()

    // Verify the change
    cy.wait(waitTime)
    cy.get('[data-cy="xaxiscol"]').should('contain', 'value')
    cy.get('[data-cy="yaxiscol"]').should('contain', 'Name')

    // Switch to a different X axis column value
    cy.get('[data-cy="xaxisdropdown"]').click()
    cy.get('[data-cy="xcol-Name"]').click()

    // Verify the change
    cy.wait(waitTime)
    cy.get('[data-cy="xaxiscol"]').should('contain', 'Name')
    cy.get('[data-cy="yaxiscol"]').should('contain', 'value')
  })

  // Y axis column drop down
  it('Y axis column drop down', () => {
    // Add a third column to table2
    cy.visit('/exec/default/Join Testing with index.sqlite')
    cy.get('.sql-terminal-input').find('textarea').type(
        'ALTER TABLE table2 ADD COLUMN value2 INTEGER DEFAULT 8')
    cy.get('[data-cy="executebtn"]').click()

    // Create a visualisation with a third column
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="sqltab"]').click()
    cy.get('[data-cy="usersqltext"]').type('{selectall}{backspace}').type(
        'SELECT table1.Name, table2.value, table2.value2\n' +
        'FROM table1, table2\n' +
        'WHERE table1.id = table2.id\n' +
        'ORDER BY table1.id')

    // Click the Run SQL button
    cy.get('[data-cy="runsqlbtn"]').click()

    // Switch to the chart settings tab
    cy.get('[data-cy="charttab"]').click()

    // Change the Y axis column value
    cy.get('[data-cy="yaxisdropdown"]').click()
    cy.get('[data-cy="ycol-value2"]').click()

    // Verify the change
    cy.wait(waitTime)
    cy.get('[data-cy="yaxiscol"]').should('contain', 'value2')

    // Switch to a different Y axis column value
    cy.get('[data-cy="yaxisdropdown"]').click()
    cy.get('[data-cy="ycol-value"]').click()

    // Verify the change
    cy.wait(waitTime)
    cy.get('[data-cy="yaxiscol"]').should('contain', 'value')
  })

  // "Show result table" button works
  it('Shows results table button works', () => {
    // Start with the existing "livetest1" visualisation
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-livetest1"]').click()

    // Verify the button starts closed
    cy.get('[data-cy="resultsbtn"]').should('contain', 'Show result table')

    // Open the results table
    cy.get('[data-cy="resultsbtn"]').click()
    cy.get('[data-cy="resultsbtn"]').should('contain', 'Hide result table')
  })

  // "Download as CSV" button
  const downloadsFolder = Cypress.config('downloadsFolder')
  it('"Download as CSV" button', () => {
    // Start with the existing "livetest1" visualisation
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-livetest1"]').click()

    // Click the download button
    cy.get('[data-cy="downcsvbtn"]').click()

    // Simple sanity check of the downloaded file
    // TODO - Implement a better check.   Maybe keep the "correct" csv in the repo as test data too, and compare against it?
    const csv = path.join(downloadsFolder, 'results.csv')
    cy.readFile(csv, 'binary', { timeout: 5000 }).should('have.length', 51)
    cy.task('rmFile', { path: csv })
  })

  // "Format SQL" button
  it('"Format SQL" button', () => {
    // Start with the existing "livetest1" visualisation
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-livetest1"]').click()

    // Click the format button
    cy.get('[data-cy="formatsqlbtn"]').click()

    // Verify the changed text
    cy.wait(waitTime)
    cy.get('[data-cy="usersqltext"]').should('contain',
      'SELECT\n' +
        '  table1.Name,\n' +
        '  table2.value\n' +
        'FROM\n' +
        '  table1,\n' +
        '  table2\n' +
        'WHERE\n' +
        '  table1.id = table2.id\n' +
        'ORDER BY\n' +
        '  table1.id;')
  })

  // "Run SQL" button
  it('"Run SQL" button', () => {
    // Start with the existing "livetest1" visualisation
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-livetest1"]').click()

    // Click the Run SQL button
    cy.get('[data-cy="runsqlbtn"]').click()

    // Verify the result
    // TODO: Probably need to add cypress attributes to the rows and columns of the results table, then
    //       check against known good return values for the testing
  })

  // "Delete" button
  it('Delete button', () => {
    cy.visit('/vis/default/Join Testing with index.sqlite')
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-abc"]').click()

    // Click the Delete button
    cy.get('[data-cy="delvisbtn"]').click()

    // Verify the result
    cy.wait(waitTime)
    cy.get('[data-cy="visdropdown"]').click()
    cy.get('[data-cy="vis-abc"]').should('not.exist')
  })

  // Verify only the owner can see this visualisation
  it('Verify private visualisation is indeed private', () => {
    // Switch to a different user
    cy.request('/x/test/switchfirst')

    // Try accessing a private database's visualisation page
    cy.visit({url: '/vis/default/Join Testing with index.sqlite', failOnStatusCode: false})
    cy.get('[data-cy="errormsg"').should('contain', 'doesn\'t exist')

    // Switch back to the default user
    cy.request('/x/test/switchdefault')
  })
})
