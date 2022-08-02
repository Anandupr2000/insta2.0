import { faker } from '@faker-js/faker';

//  creating an array of suggestions with fake details using implicit return of map fn
const data = [...Array(50)].map((_, i) => ({
    username: faker.name.findName(),
    avatar: faker.image.avatar(),
    id: i,
}))
export default data