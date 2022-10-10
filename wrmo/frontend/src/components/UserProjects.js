import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


const UserProjects = () => {

    const { user_id } = useParams()
    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])//filtered projects
    const [filterType, setFilterType] = useState('name')//the value of the filter input

    const getUserProjects = () => {
        fetch('/api/get-user-projects' + "?user_id=" + user_id)
            .then(res => res.json())
            .then(data => {
                setProjects(data)
                setFilteredProjects(data)
            })
            .catch(err => console.log(err))
    }

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value)
        if (e.target.value == "date") {
            var dateSortedProjects = projects
            //bubble sort on the array
            for (var i = 0; i < dateSortedProjects.length - 1; i++) {
                for (var j = 0; j < dateSortedProjects.length - i - 1; j++) {
                    var date1 = new Date(dateSortedProjects[j].created_at)
                    var date2 = new Date(dateSortedProjects[j + 1].created_at)
                    if (date1 > date2) {
                        var temp = dateSortedProjects[j];
                        dateSortedProjects[j] = dateSortedProjects[j + 1];
                        dateSortedProjects[j + 1] = temp;
                    }
                }
            }
            setFilteredProjects(dateSortedProjects)
        }
        else setFilteredProjects([...projects])
    }

    const handleFilterProjects = (e) => {
        setFilteredProjects([])
        var filterName = e.target.value
        if (filterName.length > 0) {
            if (filterType == "name") {
                setFilteredProjects(projects.filter(item => item.project_name.toLocaleLowerCase().includes(filterName.toLocaleLowerCase())))
            }
            else if (filterType == "work_field") {
                setFilteredProjects(projects.filter(item => item.work_field.toLocaleLowerCase().includes(filterName.toLocaleLowerCase())))
            }
            else if (filterType == "location") {
                setFilteredProjects(projects.filter(item => item.project_location.toLocaleLowerCase().includes(filterName.toLocaleLowerCase())))
            }
        }
        else {
            setFilteredProjects(projects)
        }
    }

    useEffect(() => {
        getUserProjects()
    }, [])

    const loopAllProjects = () => {
        return (
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Work field</td>
                            <td>Enrollment method</td>
                            <td>Project location</td>
                            <td>Work experience</td>
                            <td>Created at</td>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.length > 0 ? filteredProjects.map((item, index) => (
                            <tr>
                                <td><a className="project-href-table" href={`/${item.project_name}/${item.id}`}>{item.project_name}</a></td>
                                <td>{item.work_field}</td>
                                <td>{item.enrollment_method}</td>
                                <td>{item.project_location}</td>
                                <td>{item.work_experience}</td>
                                <td>{new Date(item.created_at).toDateString()}</td>
                            </tr>
                        )) : <h3>There are no activities</h3>}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="container">
            <h2 className="pt-5">Projects</h2>
            <div className="pt-4">
                {/* FILTER */}
                <div style={{ marginBottom: 50 }} class="card">
                    <div class="card-body">
                        <div style={{ paddingBottom: 20 }}>Filter projects</div>
                        <div>
                            <div class="row">
                                <div class="col-6">
                                    <input disabled={filterType == 'date'} onChange={handleFilterProjects} type="text" class="form-control" placeholder="Name"></input>
                                </div>
                                <div class="col-6">
                                    <select onChange={handleFilterTypeChange} class="form-select" aria-label="Default select example">
                                        <option value="name">Name</option>
                                        <option value="date">Date</option>
                                        <option value="work_field">Work field</option>
                                        <option value="location">Location</option>
                                    </select>
                                </div>
                                <div style={{ paddingTop: 20 }}>
                                    {/* <button className="btn btn-primary">Filter</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {loopAllProjects()}
                </div>
            </div>
        </div>
    )
}

export default UserProjects