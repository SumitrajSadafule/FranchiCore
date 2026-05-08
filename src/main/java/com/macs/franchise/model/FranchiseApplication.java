package com.macs.franchise.model;

import com.macs.franchise.model.enums.FranchiseApplicationStatus;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "franchise_applications")
@EntityListeners(AuditingEntityListener.class)
public class FranchiseApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Information
    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;

    @Column(name = "age")
    private Integer age;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    // Education
    @Column(name = "qualification", length = 200)
    private String qualification;

    @Column(name = "institution", length = 200)
    private String institution;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    // Financial Information
    @Column(name = "net_worth", precision = 15, scale = 2)
    private BigDecimal netWorth;

    @Column(name = "liquid_capital", precision = 15, scale = 2)
    private BigDecimal liquidCapital;

    @Column(name = "source_of_funds", length = 500)
    private String sourceOfFunds;

    // Business Interest
    @Column(name = "preferred_city", length = 100)
    private String preferredCity;

    @Column(name = "reason_for_interest", length = 1000)
    private String reasonForInterest;

    // Commitment
    @Column(name = "previous_ownership")
    private Boolean previousOwnership;

    @Column(name = "ownership_details", length = 500)
    private String ownershipDetails;

    @Column(name = "willing_to_train")
    private Boolean willingToTrain;

    // Legal Documents (numbers only, no files)
    @Column(name = "pan_number", length = 20)
    private String panNumber;

    @Column(name = "aadhaar_number", length = 20)
    private String aadhaarNumber;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    private FranchiseApplicationStatus status = FranchiseApplicationStatus.NEW;

    @Column(name = "admin_notes", length = 1000)
    private String adminNotes;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_date")
    private LocalDateTime reviewedDate;

    @CreatedDate
    @Column(name = "applied_date", updatable = false)
    private LocalDateTime appliedDate;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public FranchiseApplication() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public BigDecimal getNetWorth() { return netWorth; }
    public void setNetWorth(BigDecimal netWorth) { this.netWorth = netWorth; }

    public BigDecimal getLiquidCapital() { return liquidCapital; }
    public void setLiquidCapital(BigDecimal liquidCapital) { this.liquidCapital = liquidCapital; }

    public String getSourceOfFunds() { return sourceOfFunds; }
    public void setSourceOfFunds(String sourceOfFunds) { this.sourceOfFunds = sourceOfFunds; }

    public String getPreferredCity() { return preferredCity; }
    public void setPreferredCity(String preferredCity) { this.preferredCity = preferredCity; }

    public String getReasonForInterest() { return reasonForInterest; }
    public void setReasonForInterest(String reasonForInterest) { this.reasonForInterest = reasonForInterest; }

    public Boolean getPreviousOwnership() { return previousOwnership; }
    public void setPreviousOwnership(Boolean previousOwnership) { this.previousOwnership = previousOwnership; }

    public String getOwnershipDetails() { return ownershipDetails; }
    public void setOwnershipDetails(String ownershipDetails) { this.ownershipDetails = ownershipDetails; }

    public Boolean getWillingToTrain() { return willingToTrain; }
    public void setWillingToTrain(Boolean willingToTrain) { this.willingToTrain = willingToTrain; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getAadhaarNumber() { return aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }

    public FranchiseApplicationStatus getStatus() { return status; }
    public void setStatus(FranchiseApplicationStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    public LocalDateTime getReviewedDate() { return reviewedDate; }
    public void setReviewedDate(LocalDateTime reviewedDate) { this.reviewedDate = reviewedDate; }

    public LocalDateTime getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDateTime appliedDate) { this.appliedDate = appliedDate; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}