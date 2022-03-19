import { userContants } from '../actions/constants';

const initState = {
  propertie: [
    {
      id: 1,
      Name: 'Dreamy House',
      details:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
      location: 'Dhaka',
      phone: '+4857498675',
      address:
        'Green Cozzy cot Shopping Mall,2nd Floor,Opposite of Baily Star Shopping Complex',
      price: '23,43,000 TK',
      image:
        'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: 2,
      Name: 'Shopno Bilash',
      details:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
      location: 'Chittagonj',
      phone: '+4857498675',
      address:
        'Green Cozzy cot Shopping Mall,2nd Floor,Opposite of Baily Star Shopping Complex',
      price: '29,43,000 TK',
      image:
        'https://images.livemint.com/rf/Image-621x414/LiveMint/Period1/2014/11/18/Photos/house-kDw--621x414@LiveMint.jpg',
    },
    {
      id: 3,
      Name: 'Sweet Home.',
      details:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
      location: 'Comilla',
      phone: '+4857498675',
      address:
        'Green Cozzy cot Shopping Mall,2nd Floor,Opposite of Baily Star Shopping Complex',
      price: '22,43,000 TK',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ouXI9HWU_BWGwICcgUPg7Eq84jPsTP8-yg&usqp=CAU',
    },
    {
      id: 4,
      Name: 'Real Homes',
      details:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
      location: 'Chandpur',
      phone: '+4857498675',
      address:
        'Green Cozzy cot Shopping Mall,2nd Floor,Opposite of Baily Star Shopping Complex',
      price: '29,43,000 TK',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0W48ACObaKPnVcCzBDYBIwfvLNP9ZTL12JQ&usqp=CAU',
    },
    {
      id: 5,
      Name: 'Professional Homes',
      details:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.',
      location: 'Chandpur',
      phone: '+4857498675',
      address:
        'Green Cozzy cot Shopping Mall,2nd Floor,Opposite of Baily Star Shopping Complex',
      price: '26,43,000 TK',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
    },
  ],
};

export default (state = initState, action) => {
  //   switch (action.type) {
  //     case userContants.USER_REGISTER_REQUEST:
  //       state = {
  //         ...state,
  //         loading: true,
  //       };
  //       break;
  //     case userContants.USER_REGISTER_FAILURE:
  //       state = {
  //         ...state,
  //         loading: true,
  //         error: action.payload.error,
  //         message: 'sdfgdg',
  //       };
  //       break;
  //     case userContants.USER_REGISTER_SUCCESS:
  //       state = {
  //         ...state,
  //         loading: false,
  //         message: action.payload.message,
  //       };
  //       break;
  //   }
  return state;
};
