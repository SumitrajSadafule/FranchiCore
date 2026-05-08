package com.macs.franchise.model;

import com.macs.franchise.model.enums.FranchiseStatus;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "franchises")
@EntityListeners(AuditingEntityListener.class)
public class Franchise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "franchise_name", length = 100, nullable = false)
    private String franchiseName;

    @Column(name = "franchise_code", length = 20, unique = true, nullable = false)
    private String franchiseCode;

    @Column(name = "address_line1", length = 255, nullable = false)
    private String addressLine1;

    @Column(name = "address_line2", length = 255)
    private String addressLine2;

    @Column(name = "city", length = 100, nullable = false)
    private String city;

    @Column(name = "state", length = 100, nullable = false)
    private String state;

    @Column(name = "postal_code", length = 20, nullable = false)
    private String postalCode;

    @Column(name = "country", length = 100, nullable = false)
    private String country = "India";

    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private FranchiseStatus status = FranchiseStatus.ACTIVE;

    @Column(name = "opening_date")
    private LocalDateTime openingDate;

    @Column(name = "operating_hours", length = 500)
    private String operatingHours;

    @Column(name = "manager_name", length = 100)
    private String managerName;

    @Column(name = "manager_phone", length = 20)
    private String managerPhone;

    @Column(name = "manager_email", length = 100)
    private String managerEmail;

    @Column(name = "notes", length = 1000)
    private String notes;
    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "franchise_application_id")
    private FranchiseApplication franchiseApplication;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    // Constructors
    public Franchise() {}

    public Franchise(String franchiseName, String franchiseCode, String city, String phone, String email) {
        this.franchiseName = franchiseName;
        this.franchiseCode = franchiseCode;
        this.city = city;
        this.phone = phone;
        this.email = email;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFranchiseName() { return franchiseName; }
    public void setFranchiseName(String franchiseName) { this.franchiseName = franchiseName; }

    public String getFranchiseCode() { return franchiseCode; }
    public void setFranchiseCode(String franchiseCode) { this.franchiseCode = franchiseCode; }

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public FranchiseStatus getStatus() { return status; }
    public void setStatus(FranchiseStatus status) { this.status = status; }

    public LocalDateTime getOpeningDate() { return openingDate; }
    public void setOpeningDate(LocalDateTime openingDate) { this.openingDate = openingDate; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public String getManagerPhone() { return managerPhone; }
    public void setManagerPhone(String managerPhone) { this.managerPhone = managerPhone; }

    public String getManagerEmail() { return managerEmail; }
    public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public FranchiseApplication getFranchiseApplication() { return franchiseApplication; }
    public void setFranchiseApplication(FranchiseApplication franchiseApplication) { this.franchiseApplication = franchiseApplication; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    // Helper method
    public String getFullAddress() {
        StringBuilder address = new StringBuilder(addressLine1);
        if (addressLine2 != null && !addressLine2.isEmpty()) {
            address.append(", ").append(addressLine2);
        }
        address.append(", ").append(city)
               .append(", ").append(state)
               .append(" - ").append(postalCode)
               .append(", ").append(country);
        return address.toString();
    }
}