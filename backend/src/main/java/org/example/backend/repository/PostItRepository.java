package org.example.backend.repository;

import org.example.backend.entity.PostIt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostItRepository extends JpaRepository<PostIt,Long> {

}
