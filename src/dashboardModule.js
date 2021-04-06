import './styles.scss';
import axios from 'axios';

export function newGameClick(gameInfoObj) {
  // gameInfoObj is an object that contains:
  // opponent: <OPPONENT_NAME> E.g. Tybi as string
  // board: <BOARD_LENGTH> E.g. 5 as string
  return axios
    .post('/newGame', gameInfoObj)
    .catch((error) => {
      console.log(error);
    });
}

export function NewGameModal(callbackFn) {
  // 1. Clear any existing modals
  const previousModal = document.getElementById('newGameModal');
  if (previousModal) {
    console.log('previous modal found!');
    document.body.removeChild(previousModal);
  }

  // 2. Declare all the modal elements
  const modalDiv = document.createElement('div');
  const modalDialogDiv = document.createElement('div');
  const modalContentDiv = document.createElement('div');
  const modalHeaderDiv = document.createElement('div');
  const modalBodyDiv = document.createElement('div');
  const modalFooterDiv = document.createElement('div');
  const words = document.createElement('label');
  const boardSelectText = document.createElement('label');
  const modalCloseBtn = document.createElement('button');
  const modalSubmit = document.createElement('button');
  const opponentInput = document.createElement('input');
  const boardSizeInput = document.createElement('select');
  const userDataList = document.createElement('datalist');

  // 3. Declare boardsize
  const boardSize = [5, 9, 13, 17, 19, 21];

  boardSize.forEach((board) => {
    const element = document.createElement('option');
    element.value = board;
    element.innerText = `${board} x ${board}`;
    boardSizeInput.appendChild(element);
  });

  // 4. Accompanying instructions
  words.innerText = 'Choose your opponent';
  boardSelectText.innerText = 'Select your board size';
  modalSubmit.innerText = 'Create Game!';

  // 5. Set attributes and classes of modal elements
  modalDiv.setAttribute('tabindex', '-1');
  modalDiv.id = 'newGameModal';
  modalDiv.classList.add('modal', 'fade');
  modalDialogDiv.classList.add('modal-dialog');
  modalContentDiv.classList.add('modal-content');
  modalHeaderDiv.classList.add('modal-header');
  modalBodyDiv.classList.add('modal-body');
  modalFooterDiv.classList.add('modal-footer');
  modalCloseBtn.classList.add('btn-close');
  modalCloseBtn.setAttribute('data-bs-dismiss', 'modal');
  modalSubmit.classList.add('btn', 'btn-primary');
  words.classList.add('form-label');
  boardSelectText.classList.add('form-label');
  opponentInput.classList.add('form-control');
  boardSizeInput.classList.add('form-select');
  opponentInput.setAttribute('list', 'dataListOptions');
  userDataList.id = 'dataListOptions';
  opponentInput.id = 'opponentInput';
  boardSizeInput.id = 'boardSizeInput';

  // 6. Get list of users for the userDataList input field
  axios
    .get('/users')
    .then((result) => {
      console.log(result.data);
      const usersArr = result.data;
      usersArr.forEach((user) => {
        const optionEle = document.createElement('option');
        // optionEle.value = user.id;
        optionEle.value = user.name;
        userDataList.appendChild(optionEle);
      });
    })
    .catch((error) => {
      console.log(error);
    });

  // 7. Add callback function to submit button
  modalSubmit.addEventListener('click', callbackFn);

  // 8. Append elements to form the modal form
  modalDiv.appendChild(modalDialogDiv);
  modalDialogDiv.appendChild(modalContentDiv);
  modalContentDiv.appendChild(modalHeaderDiv);
  modalContentDiv.appendChild(modalBodyDiv);
  modalContentDiv.appendChild(modalFooterDiv);
  modalHeaderDiv.appendChild(modalCloseBtn);
  modalFooterDiv.appendChild(modalSubmit);
  modalBodyDiv.appendChild(words);
  modalBodyDiv.appendChild(opponentInput);
  modalBodyDiv.appendChild(userDataList);
  modalBodyDiv.appendChild(boardSelectText);
  modalBodyDiv.appendChild(boardSizeInput);

  // 9. Return modal element
  return modalDiv;
}

export function getGame(gameId) {
  return axios
    .get(`/game/${gameId}`)
    .catch((error) => console.log(error));
}

export function renderUserDashboardElement(callbackFn) {
  // 0. Declare elements
  const dashboardContainer = document.createElement('div');
  const sidebar = document.createElement('div');
  const rightContent = document.createElement('div');
  const sidebarHeader = document.createElement('div');
  const sidebarList = document.createElement('ul');
  const gameTable = document.createElement('table');
  const gameTableHead = document.createElement('thead');
  const gameTableBody = document.createElement('tbody');
  const newGameBtn = document.createElement('button');

  // 0.1. Add some styles
  gameTableHead.innerHTML = `<thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Board</th>
    </tr>
  </thead>`;
  // <th scope="col">Opponent</th>
  // <th scope="col">Turn</th>

  dashboardContainer.id = 'dashboardContainer';
  dashboardContainer.classList.add('wrapper');

  sidebarHeader.innerText = 'Play GO!';
  sidebarList.classList.add('list-unstyled', 'components');
  sidebar.id = 'sidebar';
  rightContent.id = 'content';

  // 1. Clear the view
  dashboardContainer.innerHTML = '';
  sidebarList.innerHTML = '';
  gameTableBody.innerHTML = '';

  // 2. Add newGameBtn
  newGameBtn.classList.add('btn', 'btn-primary');
  newGameBtn.innerText = 'Create new game';

  // 3. Create modal (to create new game) and assign to newGameBtn
  newGameBtn.setAttribute('data-bs-toggle', 'modal');
  newGameBtn.setAttribute('data-bs-target', '#newGameModal');
  NewGameModal();
  rightContent.appendChild(newGameBtn);

  // 4. RIGHTCONTENT: Get the table of all ongoing games
  gameTable.classList.add('table');
  gameTable.appendChild(gameTableHead);
  gameTable.appendChild(gameTableBody);
  rightContent.appendChild(gameTable);
  axios
    .get('/dashboard')
    .then((result) => {
      const userInfo = result.data;
      console.log(userInfo);
      userInfo.games.forEach((usergame) => {
        console.log(usergame.gameId);
        const gameRow = document.createElement('tr');
        const gameNo = document.createElement('th');
        const gameLink = document.createElement('td');
        const gameBtn = document.createElement('button');
        gameNo.innerText = usergame.gameId;
        gameBtn.classList.add('btn', 'btn-secondary', 'btn-sm');
        gameBtn.innerText = 'Link';
        gameBtn.addEventListener('click', () => {
          currentGame = callbackFn(usergame.gameId);
        });
        // gameRow.innerHTML = `
        // <th scope='row'>${usergame.gameId}</th>
        // <td><a href='/game/${usergame.gameId}'>Play</a></td>
        // `;
        gameRow.appendChild(gameNo);
        gameRow.appendChild(gameLink);
        gameLink.appendChild(gameBtn);
        gameTableBody.appendChild(gameRow);
      });
    })
    .catch((error) => console.log(error));

  // 5. Sidebar list
  const sidebarItems = ['User', 'Games', 'Win', 'Lose'];
  sidebarItems.forEach((item) => {
    const itemElement = document.createElement('li');
    itemElement.id = item;
    itemElement.innerText = item;
    itemElement.classList.add();
    sidebarList.appendChild(itemElement);
  });

  // 6. Create the dashboard layout by combining SIDEBAR and RIGHTCONTENT
  dashboardContainer.appendChild(sidebar);
  dashboardContainer.appendChild(rightContent);
  sidebar.appendChild(sidebarHeader);
  sidebar.appendChild(sidebarList);

  // 7. Pass the element back to user
  return dashboardContainer;
}
