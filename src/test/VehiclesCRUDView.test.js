import React from 'react';
import ReactDOM from 'react-dom';
import {render, fireEvent, cleanup, getByText} from '@testing-library/react';
 import VehiclesCRUDView from "../components/CRUD/VehiclesCRUDView";
// import {setVehicleInLimpMode} from "../services/UserService";
//
afterEach(cleanup)

it('button click changes props', () => {
    const { getByText} = render(<VehiclesCRUDView/>)

    // eslint-disable-next-line testing-library/prefer-screen-queries
    fireEvent.click(getByText("Add a new vehicle"))
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText("Introduce new vehicle information").hidden && getByText("Map").hidden).toBe(false)

})
//
// it("sets vehicle in limp mode", async () => {
//     fetch.mockResponseOnce("SUCCESS");
//     // const serverResponse = await setVehicleInLimpMode("validActionDTO","validToken")
//     //
//     // expect(serverResponse).toEqual("SUCCESS");
//     // expect(fetch).toHaveBeenCalledTimes(1);
//
//     //const { getByText } = render(<VehiclesCRUDView/>);
//
//     fireEvent.click(getByText("Add a new vehicle"))
//     expect(getByText(/Available/i).checked).toBe(false)
// });
// // it('State of "Available" checkbox is changed when "SET VEHICLE IN LIMP MODE" button clicked', async () => {
// //     const { getByText } = render(<VehiclesCRUDView/>);
// //
// //     // eslint-disable-next-line testing-library/prefer-screen-queries
// //     fireEvent.click(getByText("SET VEHICLE IN LIMP MODE"))
// //     // eslint-disable-next-line testing-library/prefer-screen-queries
// //     expect(getByText(/Available/i).checked).toBe(false)
// // })
//
//
// // it('button click changes props', () => {
// //     // const { getByText } = render(<App>
// //     //     <CompaniesCRUDView/>
// //     // </App>)
// //
// //     expect(window.screen.getByText(/Moe/i).textContent).toBe("Moe")
// //
// //     fireEvent.click(window.screen.getByText("Change Name"))
// //
// //     expect(window.screen.getByText(/Steve/i).textContent).toBe("Steve")
// // })