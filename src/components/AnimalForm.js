import React, { useState, useEffect } from 'react'
import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'

const AnimalForm = ({ errors, touched, status }) => {
  const [animals, setAnimals] = useState([])
  console.log(status)

  // subscribe to update state
  useEffect(() => {
    if (status) {
      setAnimals([...animals, status])
    }
  }, [status])

  return (
    <Form>
      {touched.species && errors.species && (
        <p className='error'>{errors.species}</p>
      )}
      <Field type='text' name='species' placeholder='Species' />
      {touched.age && errors.age && <p className='error'> {errors.age}</p>}
      <Field type='number' name='age' placeholder='Age' />
      {touched.diet && errors.diet && <p className='error'> {errors.diet}</p>}
      <Field component='select' name='diet'>
        <option value='' disabled>
          Select Diet
        </option>
        <option value='meat'>Meat</option>
        <option value='veggies'>Veggies</option>
        <option value='both'>Both</option>
      </Field>
      {touched.vaccinations && errors.vaccinations && (
        <p className='error'> {errors.vaccinations}</p>
      )}
      <label>
        <Field type='checkbox' name='vaccinations' />
        <span>Vaccinated?</span>
      </label>
      <Field component='textarea' name='notes' placeholder='Notes' />
      <button type='submit'>Submit</button>

      {animals.map(animal => (
        <div>{animal.species}</div>
      ))}
    </Form>
  )
}

export default withFormik({
  mapPropsToValues: ({ species, age, diet, vaccinations, notes }) => {
    return {
      species: species || '',
      age: age || '',
      diet: diet || '',
      vaccinations: vaccinations || false,
      notes: notes || '',
    }
  },

  // Validation
  validationSchema: Yup.object().shape({
    species: Yup.string().required('Species is required'),
    age: Yup.number()
      .positive()
      .required('Age is required'),
    diet: Yup.string().required('Diet is required'),
    vaccinations: Yup.boolean().oneOf([true]),
  }),

  handleSubmit(values, { setStatus }) {
    Axios.post('https://reqres.in/api/animals', values)
      .then(res => {
        console.log(res)
        setStatus(res.data)
      })
      .catch(err => console.log(err))
  },
})(AnimalForm)
